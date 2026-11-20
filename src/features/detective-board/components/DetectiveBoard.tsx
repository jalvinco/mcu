import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Controls,
  MarkerType,
  ReactFlow,
  useNodesState,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3';
import CharacterCardNode, { type CharacterFlowNode } from './CharacterCardNode';
import type { IncursionCaseLink, IncursionCaseSubject } from '@/types/board.types';

const nodeTypes = {
  character: CharacterCardNode,
} satisfies NodeTypes;

interface ForceNode extends SimulationNodeDatum {
  id: number;
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: number;
  target: number;
  strength: number;
}

interface DetectiveBoardProps {
  subjects: IncursionCaseSubject[];
  connections: IncursionCaseLink[];
  selectedCharacterId: number | null;
  compactGroups: boolean;
  onSelectCharacter: (characterId: number | null) => void;
}

function calculatePositions(
  subjects: IncursionCaseSubject[],
  connections: IncursionCaseLink[],
  compactGroups: boolean,
): Map<number, { x: number; y: number }> {
  const nodes: ForceNode[] = subjects.map((subject, index) => {
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const radius = 38 * Math.sqrt(index + 1);
    return {
      id: subject.character.id,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
  const nodeIds = new Set(nodes.map((node) => node.id));
  const links: ForceLink[] = connections
    .filter((connection) => nodeIds.has(connection.sourceId) && nodeIds.has(connection.targetId))
    .map((connection) => ({
      source: connection.sourceId,
      target: connection.targetId,
      strength: connection.strength,
    }));

  const simulation = forceSimulation<ForceNode>(nodes)
    .force(
      'link',
      forceLink<ForceNode, ForceLink>(links)
        .id((node) => node.id)
        .distance((link) => 315 - link.strength * 8)
        .strength(0.4),
    )
    .force('charge', forceManyBody().strength(compactGroups ? -180 : -420).distanceMax(1100))
    .force('collide', forceCollide(120).strength(0.92).iterations(2))
    .force('center', forceCenter(0, 0))
    .stop();

  for (let tick = 0; tick < 240; tick += 1) simulation.tick();

  return new Map(
    nodes.map((node) => [node.id, { x: node.x ?? 0, y: node.y ?? 0 }]),
  );
}

function createBoardNodes(
  subjects: IncursionCaseSubject[],
  connections: IncursionCaseLink[],
  positions: Map<number, { x: number; y: number }>,
  selectedCharacterId: number | null,
  currentNodes: CharacterFlowNode[] = [],
): CharacterFlowNode[] {
  const currentPositions = new Map(
    currentNodes.map((node) => [node.id, node.position] as const),
  );

  return subjects.map((subject) => ({
    id: String(subject.character.id),
    type: 'character',
    position:
      currentPositions.get(String(subject.character.id)) ??
      positions.get(subject.character.id) ??
      { x: 0, y: 0 },
    selected: subject.character.id === selectedCharacterId,
    data: {
      character: subject.character,
      movieCount: connections.filter(
        (connection) =>
          connection.sourceId === subject.character.id ||
          connection.targetId === subject.character.id,
      ).length,
      movies: [],
      isSelected: subject.character.id === selectedCharacterId,
      caseSubject: subject,
    },
  }));
}

export default function DetectiveBoard({
  subjects,
  connections,
  selectedCharacterId,
  compactGroups,
  onSelectCharacter,
}: DetectiveBoardProps) {
  const positions = useMemo(
    () => calculatePositions(subjects, connections, compactGroups),
    [subjects, connections, compactGroups],
  );
  const boardCanvasRef = useRef<HTMLDivElement>(null);
  const [offscreenCount, setOffscreenCount] = useState(0);
  const initialNodes = useMemo(
    () => createBoardNodes(subjects, connections, positions, selectedCharacterId),
    [subjects, connections, positions, selectedCharacterId],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  useEffect(() => {
    setNodes((currentNodes) =>
      createBoardNodes(subjects, connections, positions, selectedCharacterId, currentNodes),
    );
  }, [subjects, connections, positions, selectedCharacterId, setNodes]);

  const edges = useMemo(() => {
    const visibleIds = new Set(subjects.map((subject) => subject.character.id));
    const boardEdges: Edge[] = connections
      .filter(
        (connection) =>
          visibleIds.has(connection.sourceId) && visibleIds.has(connection.targetId),
      )
      .map((connection) => {
        const isConnectedToSelection =
          selectedCharacterId === null ||
          connection.sourceId === selectedCharacterId ||
          connection.targetId === selectedCharacterId;
        const isEmphasized =
          selectedCharacterId !== null && isConnectedToSelection;
        const strokeColor =
          connection.category === 'confirmed' ? '#ed4534' : '#f2be4b';

        return {
          id: `${connection.sourceId}-${connection.targetId}`,
          source: String(connection.sourceId),
          target: String(connection.targetId),
          type: 'default',
          animated: isEmphasized,
          markerEnd: isEmphasized
            ? { type: MarkerType.ArrowClosed, color: strokeColor, width: 18, height: 18 }
            : undefined,
          style: {
            stroke: strokeColor,
            strokeDasharray: connection.category === 'theory' ? '7 5' : undefined,
            strokeWidth: isEmphasized ? 7 : 5.5,
            opacity: selectedCharacterId === null ? 1 : isConnectedToSelection ? 1 : 0.35,
          },
          interactionWidth: 18,
          label: isEmphasized ? connection.label : undefined,
          labelStyle: { fill: '#3e3329', fontSize: 10, fontFamily: 'monospace' },
          labelBgStyle: { fill: '#f1e5c7', fillOpacity: 0.92 },
          labelBgPadding: [5, 3] as [number, number],
        };
      });

    return boardEdges;
  }, [subjects, connections, selectedCharacterId]);
  const updateOffscreenCount = useCallback(() => {
    const canvasBounds = boardCanvasRef.current?.getBoundingClientRect();
    const nodeElements = boardCanvasRef.current?.querySelectorAll<HTMLElement>('.react-flow__node');
    if (!canvasBounds || !nodeElements) return;

    let count = 0;
    nodeElements.forEach((node) => {
      const bounds = node.getBoundingClientRect();
      if (
        bounds.left < canvasBounds.left ||
        bounds.top < canvasBounds.top ||
        bounds.right > canvasBounds.right ||
        bounds.bottom > canvasBounds.bottom
      ) {
        count += 1;
      }
    });

    setOffscreenCount(count);
  }, []);
  const handleMoveEnd = useCallback(() => {
    window.requestAnimationFrame(updateOffscreenCount);
  }, [updateOffscreenCount]);

  useEffect(() => {
    const canvas = boardCanvasRef.current;
    if (!canvas) return undefined;

    const observer = new ResizeObserver(updateOffscreenCount);
    observer.observe(canvas);
    const frameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateOffscreenCount);
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [subjects, updateOffscreenCount]);

  return (
    <div ref={boardCanvasRef} className="board-canvas" aria-label="Interactive incursion case board">
      {subjects.length === 0 ? (
        <div className="board-empty">
          <span className="board-empty__stamp">NO MATCHES</span>
          <p>Try a different search or select another evidence group.</p>
        </div>
      ) : (
        <ReactFlow<CharacterFlowNode, Edge>
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.03, minZoom: 1.2, maxZoom: 1.35 }}
          minZoom={0.18}
          maxZoom={1.45}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          panOnScroll
          onMoveEnd={handleMoveEnd}
          onNodeClick={(_, node) => onSelectCharacter(node.data.character.id)}
          onPaneClick={() => onSelectCharacter(null)}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      )}
      {offscreenCount > 0 && (
        <div className="board-offscreen-hint" role="status">
          <span className="board-offscreen-hint__pin" aria-hidden="true" />
          {offscreenCount} {offscreenCount === 1 ? 'FILE' : 'FILES'} OUT OF VIEW - PAN TO FIND
        </div>
      )}
    </div>
  );
}
