#!/bin/bash
clear
### Remove ingress-nginx module
echo "########################################################"
echo "Removing ingress-nginx module...."
if [ -n "$(kubectl get namespaces | grep nginx)" ]; then
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
echo "ingress-nginx successfully removed"
else
    echo "Module ingress-nginx is not found. Skipping..."
fi
echo "########################################################"
echo

### Remove test host from the hosts file
OS=`uname`
# $(replace_in_file pattern file)
function replace_in_file() {
    if [ "$OS" = 'Darwin' ]; then
        # for MacOS
        sudo sed -i '' -e "$1" "$2"
    else
        # for Linux and Windows
        sudo sed -i'' -e "$1" "$2"
    fi
}
echo "Removing rates.dev from the hosts file. Your root password should be required"
$(replace_in_file 's/127.0.0.1 rates.dev//g' "/etc/hosts")
echo "Entry in hosts file successfully removed"
echo "########################################################"
echo

echo "Removing Kubernetes secrets..."
if [ -n "$(kubectl get secrets | grep app-secret)" ]; then
    kubectl delete secret app-secret
    echo "Kubernetes secret successfully deleted"
else 
    echo "Skipping deletion of secrets"
fi
echo "########################################################"
echo
echo "CLEANUP FINISHED SUCCESSFULLY!"