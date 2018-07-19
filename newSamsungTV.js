var samsungRemote = require("new-samsung-remote");



module.exports = function(RED) {
    
    function newSamsungTV(config) {
        const node_config = {
            ip_address: config.ip, // required: IP address of your Samsung Smart TV
            name: "New Samsung Remote"
        };
        RED.nodes.createNode(this, config);
		this.ip = config.ip;
		this.command = config.command;
		this.name = config.name;
		this.remote = new samsungRemote(node_config);
		var node = this;
		
        this.on('input', function (msg) {
            
            var command = node.command || msg.command;			
			if(!command){
                msg.success = false;
                msg.err = "no command defined for samsungTV!";
                node.warn(msg.err);
				node.send(msg);
            }else{
                node.remote.api_active();            
				node.remote.sendKey(command, function (err, res) {
					if (err) {
						throw new Error(err);
					} else {
						msg.success = true;
					}
					node.send(res);
				});
            }
            
        });
    }

    RED.nodes.registerType("newSamsungTV", newSamsungTV);
}