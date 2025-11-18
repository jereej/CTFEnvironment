kubectl apply -f server_deployment.yml
kubectl apply -f client_deployment.yml
kubectl apply -f gateway_implementation.yml
kubectl get pod
kubectl get service
kubectl get pod -o wide