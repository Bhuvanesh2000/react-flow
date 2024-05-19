import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initial-elements";
import Toast from "./Toast";
import MessageNode from "./MessageNode";
import WhatsappTextNode from "./WhatsappTextNode";
import TextNodeEditComp from "./TextNodeEditComp";

import "reactflow/dist/style.css";
import "./overview.css";

// Map new/custom node types
const nodeTypes = {
  whatsappTextNode: WhatsappTextNode,
  messageNode: MessageNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showErrorValidation, setShowErrorValidation] = useState(undefined);
  const [showSuccessValidation, setShowSuccessValidation] = useState(undefined);
  const error_validations = { 1: { label: "Cannot save flow" } }; // all types of errors
  const success_validations = { 1: { label: "Flow saved successfully!" } }; // all types of success messages

  // create a new edge when handles are connected
  const onConnect = useCallback((params) => {
    params["markerEnd"] = {};
    // closed type edge
    params["markerEnd"]["type"] = MarkerType.ArrowClosed;
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const edit_node = nodes.filter((node) => node.data["edit"] === true)[0]; // get node that is clicked (to be edited)

  // create id for new node (next subsequent id of last node's id)
  let new_id;
  const last_node = nodes[nodes.length - 1];
  if (last_node !== undefined) new_id = String(parseInt(last_node["id"]) + 1);

  // cancel edit operation when back button is pressed in settings panel
  const onUpdateCancelNode = (id) => {
    const node = nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            edit: false,
          },
        };
      }
      return node;
    });

    setNodes(() => node);
  };

  // update text of message once update button clicked in settings panel
  const onUpdateNode = (id, value) => {
    const node = nodes.filter((node) => node["id"] === id)[0];

    if (node["type"] === "messageNode") {
      // create new text node once after message node is updated with given text/message
      const newNode = {
        id: new_id || 1,
        type: "whatsappTextNode",
        data: {
          label: "Send Message",
          value: value,
        },
        position: node["position"],
        style: { visibility: "visible" },
      };

      // delete message node and create text node
      setNodes((prevNodes) => [...prevNodes.filter((node) => node.id !== id)]);
      setNodes((prevNodes) => [...prevNodes, newNode]);
    } else if (node["type"] === "whatsappTextNode") {
      // update existing text node with given text/message
      const node = nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              value: value,
              edit: false,
            },
          };
        }
        return node;
      });

      setNodes(() => node);
    }
  };

  // create new message node, which will be updated to text node once edited
  const createTextNode = () => {
    const newNode = {
      id: new_id || 1,
      type: "messageNode",
      data: {
        label: "Message",
        placeholder: "Enter message",
      },
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100,
      },
      style: { visibility: "visible" },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  // to save the flow, once "save changes" button is clicked
  const onSave = () => {
    // filter out only text nodes to validate errors
    const textNodes = nodes.filter((node) => node.type !== "messageNode");

    if (textNodes.length > 1) {
      const edge_target_handles = edges.map((edge) => edge["target"]);
      const edge_source_handles = edges.map((edge) => edge["source"]);

      textNodes.forEach((node) => {
        // check if text node has edge connected
        if (
          !(
            edge_target_handles.includes(node["id"]) ||
            edge_source_handles.includes(node["id"])
          )
        ) {
          // show error type '1'
          setShowErrorValidation("1");
          return;
        }
      });
    }

    // if edges are connected to every text node, show success message of type '1'
    setShowSuccessValidation("1");
  };

  // to close the validation message that is shown when "save changes" button is clicked
  const hideToast = () => {
    // reset success and error message status
    setShowErrorValidation(undefined);
    setShowSuccessValidation(undefined);
  };

  return (
    <div className="box">
      <div className="dash-nav">
        <button onClick={() => onSave()}>Save Changes</button>
      </div>
      <div style={{ display: "flex", height: "100%" }}>
        {/* Whole flow will be rendered with below component */}
        <ReactFlow
          nodes={nodes} // this will render list of nodes
          edges={edges} // this will render list of edges
          onNodesChange={onNodesChange} // this will handle any node events
          onEdgesChange={onEdgesChange} // this will handle any edge events
          fitView
          onConnect={onConnect} // this will create new edges when user connects from UI
          nodeTypes={nodeTypes} // this is to map any custom node types to render corresponsing component
          style={{ background: "#fff" }}
        >
          {/* Minimap is to show a mini overall version of flow */}
          <MiniMap
            nodeColor={(node) => {
              if (node.type === "messageNode") return "red";
              if (node.type === "whatsappTextNode") return "lightgreen";
            }}
          />
        </ReactFlow>
        <div className="side-nav">
          {/* if any node is clicked, it will be shown in settings panel to edit the node's text */}
          {edit_node !== undefined ? (
            <TextNodeEditComp
              data={edit_node["data"]}
              id={edit_node["id"]}
              onUpdateNode={(id, value) => onUpdateNode(id, value)}
              onUpdateCancelNode={(id, value) => onUpdateCancelNode(id, value)}
            />
          ) : (
            // this will create a new node (Message node)
            <div className="message-node-dup" onClick={() => createTextNode()}>
              <img
                width="25"
                height="25"
                src="https://img.icons8.com/ios/50/chat-message--v1.png"
                alt="chat-message--v1"
              />
              <div>Message</div>
            </div>
          )}
          {/* if there are more than one nodes which has no target handles, this will show an error message */}
          {showErrorValidation !== undefined ? (
            <Toast
              label={error_validations[showErrorValidation].label}
              type="error"
              hideToast={hideToast}
            />
          ) : (
            // if there are no errors, this will show success message
            showSuccessValidation !== undefined && (
              <Toast
                label={success_validations[showSuccessValidation].label}
                type="success"
                hideToast={hideToast}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
