pid_websersocket=$(pgrep -f "websersocket_9bd46617-ecc5-4639-acc5-3ef5aa4af56d.js")
watch -n 1 ps -p $pid_websersocket -o pid,etime,%cpu,%mem,cmd