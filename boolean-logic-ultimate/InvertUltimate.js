module.exports = function (RED) {
	function InvertUltimate(config) {
		RED.nodes.createNode(this, config);
		this.config = config;
		var node = this;


		function setNodeStatus({ fill, shape, text }) {
			let dDate = new Date();
			node.status({ fill: fill, shape: shape, text: text + " (" + dDate.getDate() + ", " + dDate.toLocaleTimeString() + ")" })
		}

		setNodeStatus({ fill: "grey", shape: "dot", text: "Waiting" });

		this.on('input', function (msg) {


			// 11/11/2021 Clone input message and replace only relevant topics
			const utils = require("./utils.js");
			let sPayload = utils.fetchFromObject(msg, config.payloadPropName || "payload");

			// 15/11/2021 inform user about undefined topic or payload
			if (sPayload === undefined ) {
				setNodeStatus({ fill: "red", shape: "dot", text: "Received invalid payload from " + msg.topic || "" });
				return;
			}

			var bRes = null;
			try {
				bRes = utils.ToBoolean(sPayload);
			} catch (error) {
			}
			if (bRes === undefined || bRes === null) {
				setNodeStatus({ fill: "red", shape: "dot", text: "Received non convertible boolean value " + sPayload + " from " + msg.topic });
				return;
			}

			var msgOUt = RED.util.cloneMessage(msg);
			try {
				msgOUt.payload = !bRes;
				setNodeStatus({ fill: "green", shape: "dot", text: "(Send) " + msgOUt.payload });
				node.send(msgOUt);
			} catch (error) {
				setNodeStatus({ fill: "red", shape: "dot", text: "Unable to invert the input payload " + bRes });
			}

		});

	}



	RED.nodes.registerType("InvertUltimate", InvertUltimate);
}