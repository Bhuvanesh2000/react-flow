import { useReactFlow } from "reactflow";

export default function MessageNode({ data, id }) {
  const reactFlow = useReactFlow();
  const { setNodes } = useReactFlow();

  const onMessageNodeClick = (id) => {
    let nodes = reactFlow.getNodes();

    // set node to be editable
    const newNodes = nodes.map((node) => {
      if (node.id === id && node.type === "messageNode") {
        return {
          ...node,
          data: {
            ...node.data,
            edit: true,
          },
        };
      }
      return node;
    });

    setNodes(() => newNodes);
  };

  return (
    // enable editing new message node to convert it to text node once text/message is provided
    <div className="node message-node" onClick={() => onMessageNodeClick(id)}>
      <img
        width="15"
        height="15"
        src="https://img.icons8.com/ios/50/chat-message--v1.png"
        alt="chat-message--v1"
      />
      <div>{data["label"]}</div>
    </div>
  );
}
