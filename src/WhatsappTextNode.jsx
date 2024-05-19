import { Handle, Position, useReactFlow } from "reactflow";
export default function WhatsappTextNode({ data, id }) {
  const reactFlow = useReactFlow();
  const { setNodes } = useReactFlow();

  // mark selected node as editable
  const editNode = (id) => {
    let nodes = reactFlow.getNodes();

    const newNodes = nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            edit: true,
          },
        };
      } else {
        return {
          ...node,
          data: {
            ...node.data,
            edit: false,
          },
        };
      }
    });

    setNodes(() => newNodes);
  };

  return (
    // click event on text node to mark node as editable
    <div className="text-node node" onClick={() => editNode(id)}>
      <div className="text-node-header">
        <div>
          <img
            width="6"
            height="6"
            src="https://img.icons8.com/ios/50/chat-message--v1.png"
            alt="chat-message--v1"
            style={{ marginRight: "3px" }}
          />
          <span style={{ fontSize: "7px" }}>{data["label"]}</span>
        </div>
        <img
          width="8"
          height="8"
          src="https://img.icons8.com/color/48/whatsapp--v1.png"
          alt="whatsapp--v1"
        />
      </div>
      <div style={{ padding: "5px 2px" }}>{data["value"]}</div>
      <Handle type="source" position={Position.Right} id="2" />
      <Handle type="target" position={Position.Left} id="1" />
    </div>
  );
}
