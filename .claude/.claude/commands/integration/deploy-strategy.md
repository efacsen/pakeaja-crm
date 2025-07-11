# /deploy-strategy [environment]

Create deployment plan.

## Description
Generates complete deployment strategy including build configuration, CI/CD pipeline, rollback procedures, and monitoring setup.

## Usage
```
/deploy-strategy production
/deploy-strategy staging
/deploy-strategy kubernetes
```

## Output Includes
- Build configuration files
- Environment variables
- CI/CD pipeline (GitHub Actions/GitLab CI)
- Docker configuration
- Kubernetes manifests
- Rollback procedures
- Health checks
- Monitoring/alerting setup
