module.exports = function (RED) {
  function AzureOpenAIConfigNode(prop) {
    RED.nodes.createNode(this, prop);
    this.api = prop.api;
    this.endpoint = prop.endpoint;
  }
  RED.nodes.registerType("azure-openai-configuration", AzureOpenAIConfigNode);
};
