import { useEffect, useRef, useState } from 'react';

/**
 * x6 图实例最小接口。
 */
interface FlowGraph {
  addNode(node: Record<string, unknown>): { id: string };
  addEdge(edge: Record<string, unknown>): unknown;
  getNodes(): Array<{ id: string }>;
  getEdges(): unknown[];
  centerContent(): void;
  zoomToFit(options: Record<string, unknown>): void;
  on(eventName: string, handler: (...args: unknown[]) => void): void;
  off(eventName: string, handler: (...args: unknown[]) => void): void;
  dispose(): void;
}

/**
 * x6 流程图剥离层示例。
 * @returns React 组件。
 */
export function X6FlowCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<FlowGraph | null>(null);
  const nodeSerialRef = useRef(3);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState('无');

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    let disposed = false;
    let graph: FlowGraph | null = null;
    let syncStats: (() => void) | null = null;
    let handleNodeClick: ((eventData: unknown) => void) | null = null;

    const setup = async () => {
      const moduleName = '@antv/x6';
      const x6 = await import(moduleName);
      const GraphConstructor = x6.Graph as new (options: Record<string, unknown>) => FlowGraph;

      if (disposed || !containerRef.current) {
        return;
      }

      graph = new GraphConstructor({
        container: containerRef.current,
        background: { color: '#f8fafc' },
        grid: {
          visible: true,
          size: 12,
        },
        panning: true,
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl', 'meta'],
        },
        interacting: {
          nodeMovable: true,
        },
        connecting: {
          allowBlank: false,
          allowLoop: false,
          snap: true,
        },
      });

      graphRef.current = graph;

      const startNode = graph.addNode({
        id: 'node-start',
        shape: 'rect',
        x: 56,
        y: 120,
        width: 120,
        height: 44,
        attrs: {
          body: {
            fill: '#e0f2fe',
            stroke: '#0284c7',
            strokeWidth: 1,
            rx: 8,
            ry: 8,
          },
          label: {
            text: '开始',
            fill: '#0f172a',
          },
        },
      });

      const processNode = graph.addNode({
        id: 'node-process',
        shape: 'rect',
        x: 300,
        y: 120,
        width: 140,
        height: 44,
        attrs: {
          body: {
            fill: '#dcfce7',
            stroke: '#16a34a',
            strokeWidth: 1,
            rx: 8,
            ry: 8,
          },
          label: {
            text: '处理节点',
            fill: '#0f172a',
          },
        },
      });

      graph.addEdge({
        source: startNode,
        target: processNode,
        attrs: {
          line: {
            stroke: '#334155',
            strokeWidth: 1.4,
            targetMarker: {
              name: 'classic',
              size: 8,
            },
          },
        },
      });

      syncStats = () => {
        if (!graph) {
          return;
        }
        setNodeCount(graph.getNodes().length);
        setEdgeCount(graph.getEdges().length);
      };

      handleNodeClick = (eventData) => {
        const nextNodeId = (
          eventData as { node?: { id?: string } }
        )?.node?.id;
        setSelectedNodeId(nextNodeId ?? '无');
      };

      graph.on('node:added', syncStats);
      graph.on('node:removed', syncStats);
      graph.on('edge:added', syncStats);
      graph.on('edge:removed', syncStats);
      graph.on('node:click', handleNodeClick);

      syncStats();
    };

    void setup();

    return () => {
      disposed = true;
      if (graph && syncStats && handleNodeClick) {
        graph.off('node:added', syncStats);
        graph.off('node:removed', syncStats);
        graph.off('edge:added', syncStats);
        graph.off('edge:removed', syncStats);
        graph.off('node:click', handleNodeClick);
      }
      graph?.dispose();
      graphRef.current = null;
    };
  }, []);

  /**
   * 新增节点并居中显示。
   */
  function appendNode() {
    const graph = graphRef.current;
    if (!graph) {
      return;
    }

    const serial = nodeSerialRef.current;
    nodeSerialRef.current += 1;
    graph.addNode({
      id: `node-${serial}`,
      shape: 'rect',
      x: 160 + serial * 24,
      y: 220 + (serial % 2) * 52,
      width: 128,
      height: 44,
      attrs: {
        body: {
          fill: '#fee2e2',
          stroke: '#dc2626',
          strokeWidth: 1,
          rx: 8,
          ry: 8,
        },
        label: {
          text: `节点 ${serial}`,
          fill: '#111827',
        },
      },
    });
    graph.centerContent();
  }

  /**
   * 连接最后两个节点。
   */
  function connectLastTwoNodes() {
    const graph = graphRef.current;
    if (!graph) {
      return;
    }

    const nodes = graph.getNodes();
    if (nodes.length < 2) {
      return;
    }

    graph.addEdge({
      source: nodes[nodes.length - 2],
      target: nodes[nodes.length - 1],
    });
  }

  return (
    <div className="x6-demo">
      <aside className="x6-demo__sidebar">
        <h3>x6 内容剥离层</h3>
        <button type="button" onClick={appendNode}>新增节点</button>
        <button type="button" onClick={connectLastTwoNodes}>连接末尾节点</button>
        <button type="button" onClick={() => graphRef.current?.zoomToFit({ padding: 24, maxScale: 1.2 })}>缩放适配</button>
        <button type="button" onClick={() => graphRef.current?.centerContent()}>居中画布</button>
        <ul>
          <li>节点数：{nodeCount}</li>
          <li>连线数：{edgeCount}</li>
          <li>当前选中：{selectedNodeId}</li>
        </ul>
      </aside>
      <section className="x6-demo__canvas">
        <div ref={containerRef} className="x6-demo__canvas-inner" />
      </section>
    </div>
  );
}
