module.exports = function(RED) {
    function FilterUltimate(config) {
        RED.nodes.createNode(this,config);
		this.config = config;
		var node = this;
		node.status( {fill:  "grey" ,shape: "dot" ,text: "Waiting"});
		this.on('input', function (msg) {
			var sTopic = node.config.name;
			if (msg.hasOwnProperty("topic")){
				sTopic = (msg.topic === "" ? sTopic : msg.topic);
			}
			
			if (typeof msg.payload !== "undefined") {
				var bRes = ToBoolean(msg.payload);
				if (typeof bRes === "undefined") return;
				var msgTrue = { 
					topic: sTopic,
					payload: true
				};
				var msgFalse = { 
					topic: sTopic,
					payload: false
				};
				if (bRes === true) {
					node.status( {fill:  "green" ,shape: "dot" ,text: "(Send) true,null"});
					node.send([msgTrue, null]);
				} else
				{
					node.status( {fill:  "green" ,shape: "dot" ,text: "(Send) null,false"});
					node.send([null, msgFalse]);
				}
				return;
			}
        });
		
		

		function ToBoolean( value ) {
			var res = false;
	
			if (typeof value === 'boolean') {
				res = value;
			} 
			else if( typeof value === 'number' || typeof value === 'string' ) {
				// Is it formated as a decimal number?
				if( decimal.test( value ) ) {
					var v = parseFloat( value );
					res = v != 0;
				}
				else {
					res = value.toLowerCase() === "true";
				}
			}
			
			return res;
		};
    }	
	
	
    RED.nodes.registerType("FilterUltimate",FilterUltimate);
}