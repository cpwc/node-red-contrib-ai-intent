const { end } = require("../globalUtils");
const { chatGPTHelper } = require("./ChatGPTHelper");
const { ollamaHelper } = require("./OllamaHelper");
const { geminiHelper } = require("./GeminiHelper");
const { azureOpenAIHelper } = require("./AzureOpenAIHelper");
const { TYPES } = require("../constants");

const PLATFORM = [
  { value: "gpt", label: "ChatGPT" },
  { value: "gemini", label: "Gemini" },
  { value: "ollama", label: "Ollama" },
  { value: "azureopenai", label: "Azure OpenAI" },
];

module.exports = function (RED) {
  function LLMChatNode(config) {
    RED.nodes.createNode(this, config);
    this.platform = RED.nodes.getNode(config.platform);
    const node = this;
    this.on("input", function (msg, send, done = () => { }) {
      try {
        node.status({ fill: "green", shape: "ring", text: "Working..." });
        switch (node.platform.platform) {
          case "gpt":
            chatGPTHelper({ node, RED, config, msg }, finish)
            break
          case "ollama":
            ollamaHelper({ node, RED, config, msg }, finish)
            break
          case "gemini":
            geminiHelper({ node, RED, config, msg }, finish)
            break
          case "azureopenai":
            azureOpenAIHelper({ node, RED, config, msg }, finish)
            break
          default:
            node.status({ fill: "red", shape: "ring", text: "Invalid configuration platform" });
            finish(`The configuration of this node is invalid platform ${node.platform.platform}`)
        }
      } catch (e) {
        finish(e)
      }

      /**
       * Callback function to handle errors and completed flows
       * @param error
       * @param payload
       */
      function finish(error, payload) {
        if (error) {
          node.status({ fill: "red", shape: "dot", text: "Error" });
          return end(done, error)
        } else if (send && payload) {
          send(payload)
        } else if (payload) {
          config.send.apply(node, arguments);
          end(done)
        }
        node.status({ fill: "grey", shape: "dot", text: "Done" });

      }
    });
  }

  RED.nodes.registerType(TYPES.LLMChat, LLMChatNode, {
    settings: {
      lLMChatPlatforms: {
        value: PLATFORM,
        exportable: true,
      },
    },
  });
};
