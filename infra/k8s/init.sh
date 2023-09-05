#!/bin/bash
clear
echo "Starting initial setup"
echo
### Setup ingress-nginx module
echo "########################################################"
echo Installing the ingress-nginx controller to the Kubernetes cluster...
if [[ $(kubectl get namespaces | grep ingress-nginx) ]]; then
    echo "skipping ingress-nginx setup"
else
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
    kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s
    echo "ingress-nginx successfully installed"
fi
echo "########################################################"
echo

### Add rates.dev to the hosts file
echo "Adding rates.dev to the hosts file. Your root password should be required..."
if [ -n "$(grep rates.dev /etc/hosts)" ]; then
    echo rates.dev is already there. Skipping....
else
    sudo -- sh -c -e "echo '127.0.0.1 rates.dev' >> /etc/hosts"
    echo "host rates.dev successfully added"
fi
echo "########################################################"
echo

### Setting up the env vars
echo "Adding env vars to the Kubernetes secrets"
if [[ $(kubectl get secrets | grep app-secret) ]]; then
    echo "skipping secrets setup"
else
    read -sp "Your new DB password: " db_password
    kubectl create secret generic app-secret --from-literal=POSTGRES_PASSWORD=$db_password
fi
echo "########################################################"
echo
echo "SETUP FINISHED SUCCESSFULLY!"