import boto3
import argparse
import time
from pipeline_connector import PipelineConnector

parser = argparse.ArgumentParser()
parser.add_argument('-p', '--pipeline', dest='pipeline_name', default='dev-deploy-pipeline',
    metavar='<name>', type=str, help="name of a pipeline to execute")
parser.add_argument('-b', '--branch', dest='branch', default='master',
    metavar='<branch>', type=str, help="branch which will be used to execute pipeline")
args = parser.parse_args()

client = boto3.client('codepipeline')
pipeline_arn = client.get_pipeline(name = args.pipeline_name)['metadata']['pipelineArn']

print(f"Pipeline will be executed on branch: {args.branch}")

client.tag_resource(resourceArn = pipeline_arn, tags = [
    {
        'key': 'branch',
        'value': args.branch
    }
])
print("Pipeline tagged with branch name")

print("Executing pipeline...")
execution = client.start_pipeline_execution(name = args.pipeline_name)
print("Pipeline execution started")

connector = PipelineConnector(args.pipeline_name, execution['pipelineExecutionId'])

# synchronization with pipeline execution
current_stage = None
while True:
    if current_stage:
        print("Stage result: " + connector.wait_stage(current_stage))

    execution_status = connector.wait_execution_status(timeout = 20)
    if not execution_status in ['Pending', 'InProgress']:
        print("Pipeline execution complete. Result: " + execution_status)
        exit()

    action = connector.get_current_action()

    if action['stageName'] != current_stage:
        print("Executing stage: " + action['stageName'])

    current_stage = action['stageName']
    time.sleep(2)