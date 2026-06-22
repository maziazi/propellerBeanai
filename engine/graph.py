# KnowledgeGraph — builds a networkx graph from all mind outputs

import networkx as nx

class KnowledgeGraph:
    def __init__(self):
        self.graph = nx.DiGraph()

    def build(self, all_results: dict) -> nx.DiGraph:
        raise NotImplementedError("KnowledgeGraph not yet implemented")
