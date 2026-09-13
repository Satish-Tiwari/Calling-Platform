# Graphify Reference & Command Cheatsheet

## 1. Core Concepts
- **Nodes**: Entities in the codebase (modules, classes, methods, React components, hooks, document files).
- **Edges**: Relationships between nodes (`imports_from`, `imports`, `calls`, `implements`, `references`, `conceptually_related_to`).
- **Communities**: Louvain community clusters grouping tightly coupled components.
- **Hub (God) Nodes**: High-degree central nodes that anchor multiple flows (e.g. `SignalingGateway`, `UsersService`, `CallContext`).

## 2. CLI Query Commands
- **Summary**:
  ```bash
  graphify summary
  # or
  npm run graphify:summary
  ```
  Returns top hubs, key communities, graph density, and recommendations.

- **Query**:
  ```bash
  graphify query "<question>"
  # Example:
  graphify query "How does dynamic call merging work?"
  ```
  Performs BFS traversal through nodes and relations to answer the architecture question.

- **Path Finding**:
  ```bash
  graphify path "<source_node>" "<target_node>"
  # Example:
  graphify path "SignalingGateway" "CallsService"
  ```
  Finds the shortest directed/undirected path between two entities.

- **Node Explain**:
  ```bash
  graphify explain "<node_label_or_id>"
  # Example:
  graphify explain "SignalingGateway"
  ```
  Prints source location, community, degree, and all direct connections with relation types.

- **Tree View**:
  ```bash
  graphify tree "<node_name>"
  # Example:
  graphify tree "App"
  ```
  Displays a hierarchical tree view starting from the specified node.

- **Ontology Studio Export**:
  ```bash
  npm run graphify:studio
  # Exports to .graphify/studio/studio.html
  ```

## 3. Top Hub Nodes in Calling Platform
1. `SignalingGateway` (`src/signaling/signaling.gateway.ts`): Socket.IO WebSocket signaling coordinator.
2. `UsersService` (`src/users/users.service.ts`): User data management and authentication verification.
3. `FriendsService` (`src/friends/friends.service.ts`): Friendship relationships and invitation events.
4. `CallContext` (`frontend/src/context/CallContext.tsx`): Frontend state manager for active calls, WebRTC mesh, media devices, and tone synthesis.
5. `App` (`frontend/src/App.tsx`): Main UI shell managing modals, sidebar, and chat views.
