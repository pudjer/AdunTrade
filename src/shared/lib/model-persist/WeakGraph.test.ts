import { WeakGraph } from './WeakGraph'; // Replace with the actual module path
import { describe, beforeEach, test, expect } from 'vitest';
interface Node {
  id: string;
}

describe('WeakGraph', () => {
  let graph: WeakGraph<Node, number>;

  beforeEach(() => {
    graph = new WeakGraph<Node, number>();
  });

  test('setTriplet should add a triplet to the graph', () => {
    const nodeA = { id: 'A' };
    const nodeB = { id: 'B' };
    graph.setTriplet({ parent: nodeA, child: nodeB, link: 1 });
    expect(graph.getTriplets({parent: nodeA})).toEqual([{ parent: nodeA, child: nodeB, link: 1 }]);
  });

  test('getTriplets should retrieve triplets based on specified nodes and link', () => {
    const nodeA = { id: 'A' };
    const nodeB = { id: 'B' };
    const nodeC = { id: 'C' };

    graph.setTriplet({ parent: nodeA, child: nodeB, link: 1 });
    graph.setTriplet({ parent: nodeA, child: nodeC, link: 2 });
    graph.setTriplet({ parent: nodeB, child: nodeC, link: 3 });

    expect(graph.getTriplets({ parent: nodeA })).toEqual([
      { parent: nodeA, child: nodeB, link: 1 },
      { parent: nodeA, child: nodeC, link: 2 },
    ]);

    expect(graph.getTriplets({ child: nodeC })).toEqual([
      { parent: nodeA, child: nodeC, link: 2 },
      { parent: nodeB, child: nodeC, link: 3 },
    ]);

    expect(graph.getTriplets({ parent: nodeA, child: nodeC, link: 2 })).toEqual([
      { parent: nodeA, child: nodeC, link: 2 },
    ]);
  });

  test('deleteTriplets should remove triplets based on specified nodes and link', () => {
    const nodeA = { id: 'A' };
    const nodeB = { id: 'B' };
    const nodeC = { id: 'C' };

    graph.setTriplet({ parent: nodeA, child: nodeB, link: 1 });
    graph.setTriplet({ parent: nodeA, child: nodeC, link: 2 });
    graph.setTriplet({ parent: nodeB, child: nodeC, link: 3 });

    graph.deleteTriplets({ parent: nodeA });
    expect(graph.getTriplets({parent: nodeB})).toEqual([{ parent: nodeB, child: nodeC, link: 3 }]);

    graph.deleteTriplets({ child: nodeC, link: 3 });
    graph.deleteTriplets({ child: nodeC, link: 2 });

    expect(graph.getTriplets({child: nodeC})).toEqual([]);

    // Add more test cases for deleteTriplets as needed
  });

  // Add more tests as needed for edge cases, defaults, and additional functionality
});
