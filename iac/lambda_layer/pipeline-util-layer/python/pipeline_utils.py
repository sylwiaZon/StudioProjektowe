import boto3
import shutil
import time
import yaml

ssm = boto3.client('ssm')
ec2 = boto3.resource('ec2')
s3 = boto3.client('s3')

def get_instance_by_name(name):
    for instance in ec2.instances.all():
        instance_name = [tag['Value'] for tag in instance.tags if tag['Key']=='Name'][0]
        if instance_name==name:
            return instance
    raise Exception("Instance not found")
    
def wait_command(command_id, timeout):
    status = ""
    
    while timeout > 0:
        result = ssm.list_command_invocations(CommandId = command_id)
        invocations = result['CommandInvocations']
        
        if len(invocations) > 0:
            status = invocations[0]['Status']
            if status != 'InProgress' and status != 'Pending':
                return status
            
        time.sleep(1)
        timeout -= 1.
        
    return "WaitResultTimeout. Status: " + status
    
def get_code_artifact(event):
    input_artifacts = event['CodePipeline.job']['data']['inputArtifacts']
    code_artifact_list = [artifact for artifact in input_artifacts if artifact['name']=='code-artifact']
    
    if len(code_artifact_list) == 0:
        raise Exception("Input artifact with name code_artifact not found")

    code_artifact = code_artifact_list[0]
    s3_bucket = code_artifact['location']['s3Location']['bucketName']
    s3_path = code_artifact['location']['s3Location']['objectKey'] + ".zip"
    
    s3.download_file(s3_bucket, s3_path, "/tmp/code.zip")
    shutil.unpack_archive("/tmp/code.zip", "/tmp/code")
    return "/tmp/code"
    
def run_shell_script(instance, script, timeout=60):
    results = ssm.send_command(
        InstanceIds = [instance.id],
        DocumentName = 'AWS-RunShellScript',
        TimeoutSeconds = int(timeout) if timeout >= 30 else 30,
        CloudWatchOutputConfig = {
            'CloudWatchLogGroupName': 'codepipeline-build',
            'CloudWatchOutputEnabled': True
        },
        Parameters = {
            'commands': [
                script
            ]
        }
    )
    command_id = results['Command']['CommandId']
    return wait_command(command_id, timeout)
    
def get_buildspec():
    buildspec_path = "/tmp/code/iac/buildspec.yaml"
    with open(buildspec_path, 'r') as stream:
        return yaml.safe_load(stream)