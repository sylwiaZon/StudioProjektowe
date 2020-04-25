import boto3
import argparse

parser = argparse.ArgumentParser()

parser.add_argument('-p', '--pipeline', dest='pipeline_name', default='dev-deploy-pipeline',
    metavar='<name>', type=str, help="name of a pipeline to execute")
parser.add_argument('-b', '--branch', dest='branch', default='master',
    metavar='<branch>', type=str, help="branch which will be used to execute pipeline")
args = parser.parse_args()

print(f"Pipeline will be executed on branch: {args.branch}")

client = boto3.client('codepipeline')
pipeline_arn = client.get_pipeline(name = args.pipeline_name)['metadata']['pipelineArn']

client.tag_resource(resourceArn = pipeline_arn, tags = [
    {
        'key': 'branch',
        'value': args.branch
    }
])
print("Pipeline tagged with branch name")

print("Executing pipeline...")
client.start_pipeline_execution(name = args.pipeline_name)
print("Pipeline execution started")