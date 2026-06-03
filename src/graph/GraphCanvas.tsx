import CytoscapeComponent from "react-cytoscapejs";

const elements = [
  {
    data: {
      id: "internet",
      label: "Internet",
    },
  },
  {
    data: {
      id: "laptops",
      label: "Laptops",
    },
  },
  {
    data: {
      id: "desktops",
      label: "Desktops",
    },
  },
  {
    data: {
      id: "servers",
      label: "Servers",
    },
  },
  {
    data: {
      id: "routers",
      label: "Routers",
    },
  },

  {
    data: {
      source: "internet",
      target: "routers",
    },
  },

  {
    data: {
      source: "routers",
      target: "servers",
    },
  },

  {
    data: {
      source: "routers",
      target: "laptops",
    },
  },

  {
    data: {
      source: "routers",
      target: "desktops",
    },
  },
];

export default function GraphCanvas() {
  return (
    <CytoscapeComponent
      elements={elements}
      style={{
        width: "100%",
        height: "100vh",
      }}
      layout={{
        name: "breadthfirst",
      }}
      stylesheet={[
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "background-color": "#2563eb",
            color: "#ffffff",
            width: 80,
            height: 80,
            "font-size": 12,
          },
        },

        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#94a3b8",
            "target-arrow-color": "#94a3b8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ]}
    />
  );
}