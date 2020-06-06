import boto3
import time

client = boto3.client('codepipeline')

class PipelineConnector:
    def __init__(self, pipeline_name, execution_id, timeout=600, refresh_rate = 1):
        self.pipeline_name = pipeline_name
        self.execution_id = execution_id
        self.timeout = timeout
        self.refresh_rate = 1

    def get_action_executions(self):
        return client.list_action_executions(
            pipelineName = self.pipeline_name,
            filter = { 'pipelineExecutionId': self.execution_id }
        )

    def get_current_action(self, timeout=None):
        ttl = timeout if timeout else self.timeout

        running_actions = []
        while len(running_actions) < 1:
            action_executions = self.get_action_executions()
            running_actions = [action for action in action_executions['actionExecutionDetails'] if action['status'] in ['Pending', 'InProgress']]
            time.sleep(self.refresh_rate)
            ttl -= self.refresh_rate

            if ttl < 0:
                raise TimeoutError

        return running_actions[0]

    def wait_stage(self, stage_name, timeout=None):
        ttl = timeout if timeout else self.timeout

        stage_result = None
        while not stage_result or stage_result in ['Pending', 'InProgress']:
            action_executions = self.get_action_executions()
            stage_result = [e['status'] for e in action_executions['actionExecutionDetails'] if e['stageName'] == stage_name][0]
            time.sleep(self.refresh_rate)
            ttl -= self.refresh_rate

            if ttl < 0:
                raise TimeoutError

        return stage_result

    def wait_execution_status(self, timeout=None):
        ttl = timeout if timeout else self.timeout

        execution_result = None
        while not execution_result:
            try:
                execution_result = client.get_pipeline_execution(pipelineName=self.pipeline_name, pipelineExecutionId=self.execution_id)
                return execution_result['pipelineExecution']['status']

            except:
                time.sleep(self.refresh_rate)

                if ttl < 0:
                    raise TimeoutError