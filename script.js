// Linear Connected Gallery - Modular JavaScript
class LinearConnector {
  constructor(config = null) {
    this.svg = document.querySelector('.connections-svg');
    this.nodeContainer = document.querySelector('#node-container');
    this.nodes = [];
    this.lines = [];
    this.isInitialized = false;
    this.resizeTimeout = null;
    this.config = config || window.galleryConfig || null;
    
    this.init();
  }
  
  init() {
    this.svg.setAttribute('width', window.innerWidth);
    this.svg.setAttribute('height', window.innerHeight);
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (this.config) {
          this.renderNodes();
          this.calculateLayout();
          this.applyLayout();
          this.createConnections();
        } else {
          this.createConnectionsLegacy();
        }
        this.setupEventListeners();
        this.hideLoadingIndicator();
        this.isInitialized = true;
        console.log('Connected gallery initialized');
      }, 100);
    });
  }
  
  hideLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.opacity = '0';
      setTimeout(() => {
        loadingIndicator.style.display = 'none';
      }, 300);
    }
    document.body.classList.add('loaded');
  }
  
  renderNodes() {
    if (!this.config || !this.config.nodes) return;
    
    this.nodeContainer.innerHTML = '';
    this.nodes = [];
    
    this.config.nodes.forEach((nodeData, index) => {
      const nodeId = nodeData.id || `node-${index}`;
      
      let element;
      if (nodeData.type === 'text') {
        element = document.createElement('div');
        element.className = 'text-container node-item';
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', nodeData.content);
        
        if (nodeData.link) {
          const a = document.createElement('a');
          a.href = nodeData.link;
          a.className = 'description node-link';
          a.textContent = nodeData.content;
          a.style.textDecoration = 'none';
          a.style.color = 'inherit';
          a.style.display = 'block';
          element.appendChild(a);
        } else {
          const p = document.createElement('p');
          p.className = 'description';
          p.textContent = nodeData.content;
          element.appendChild(p);
        }
        
      } else if (nodeData.type === 'image') {
        element = document.createElement('div');
        element.className = 'image-container node-item';
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'img');
        element.setAttribute('aria-label', nodeData.alt || '');
        
        const img = document.createElement('img');
        img.src = nodeData.src;
        img.alt = nodeData.alt || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        
        if (nodeData.link) {
          element.removeAttribute('tabindex');
          element.removeAttribute('role');
          element.removeAttribute('aria-label');
          const a = document.createElement('a');
          a.href = nodeData.link;
          a.className = 'image-link node-link';
          a.appendChild(img);
          element.appendChild(a);
        } else {
          element.appendChild(img);
        }
        
      } else if (nodeData.type === 'mixed') {
        element = document.createElement('div');
        element.className = 'mixed-container node-item';
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', nodeData.text || '');
        
        const textFirst = nodeData.textPosition === 'top';
        
        if (nodeData.text && textFirst) {
          const lines = nodeData.text.split('\n');
          lines.forEach(line => {
            if (line.trim()) {
              const p = document.createElement('p');
              p.className = 'description mixed-text';
              p.textContent = line;
              p.style.margin = '0 0 5px 0';
              element.appendChild(p);
            }
          });
        }
        
        if (nodeData.image) {
          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'mixed-image';
          const img = document.createElement('img');
          img.src = nodeData.image.src;
          img.alt = nodeData.image.alt || '';
          img.loading = 'lazy';
          img.decoding = 'async';
          imgWrapper.appendChild(img);
          element.appendChild(imgWrapper);
        }
        
        if (nodeData.text && !textFirst) {
          const p = document.createElement('p');
          p.className = 'description mixed-text';
          p.textContent = nodeData.text;
          element.appendChild(p);
        }

      } else if (nodeData.type === 'embed') {
        element = document.createElement('div');
        element.className = 'embed-container node-item';
        element.setAttribute('tabindex', '0');
        element.setAttribute('role', 'region');
        element.setAttribute('aria-label', 'Bandcamp player');

        if (nodeData.embedType === 'bandcamp' && nodeData.trackId) {
          const iframe = document.createElement('iframe');
          iframe.style.border = '2px solid white';
          iframe.style.width = '350px';
          iframe.style.height = '442px';
          iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${nodeData.trackId}/size=large/bgcol=ffffff/linkcol=63b2cc/tracklist=false/`;
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allow', 'autoplay');
          element.appendChild(iframe);
        }
      }
      
      element.id = nodeId;
      element.dataset.index = index;
      element.dataset.type = nodeData.type;
      
      this.nodeContainer.appendChild(element);
      this.nodes.push({
        element,
        data: nodeData,
        index,
        id: nodeId
      });
    });
    
    console.log(`Rendered ${this.nodes.length} nodes`);
  }
  
  calculateLayout() {
    if (!this.config || !this.config.nodes) return;
    
    const nodeCount = this.config.nodes.length;
    const layout = this.config.layout || [];
    
    if (layout.length >= nodeCount) {
      this.explicitLayout = true;
      return;
    }
    
    this.explicitLayout = false;
    this.autoLayout = [];
    
    const screenWidth = window.innerWidth;
    let cols = 3;
    if (screenWidth < 768) cols = 1;
    else if (screenWidth < 1200) cols = 2;
    
    const rowHeight = 2;
    
    for (let i = 0; i < nodeCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      let colSpan = 1;
      let rowSpan = 1;
      let alignSelf = 'stretch';
      
      if (cols === 3) {
        if (row === 0) {
          if (i === 0) alignSelf = 'flex-start';
          else if (i === 1) alignSelf = 'center';
          else if (i === 2) alignSelf = 'flex-end';
          else alignSelf = 'center';
        }
      } else if (cols === 2) {
        if (row === 0) {
          if (i === 0) alignSelf = 'flex-start';
          else if (i === 1) alignSelf = 'flex-start';
          else alignSelf = 'center';
        }
      } else {
        alignSelf = 'center';
      }
      
      this.autoLayout.push({
        row: row + 1,
        col: col + 1,
        rowSpan,
        colSpan,
        alignSelf
      });
    }
    
    if (cols === 2 && nodeCount === 3) {
      this.autoLayout[2] = { row: 2, col: 1, rowSpan: 1, colSpan: 2, alignSelf: 'center' };
    }
  }
  
  applyLayout() {
    if (!this.nodes.length) return;
    
    const screenWidth = window.innerWidth;
    let cols = 3;
    if (screenWidth < 768) cols = 1;
    else if (screenWidth < 1200) cols = 2;
    
    this.nodeContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    if (screenWidth < 768) {
      this.nodes.forEach((node, index) => {
        node.element.style.gridRow = 'auto';
        node.element.style.gridColumn = '1';
        node.element.style.justifySelf = 'center';
        node.element.dataset.index = index;
      });
      return;
    }
    
    if (this.explicitLayout && this.config.layout) {
      this.nodes.forEach((node, index) => {
        const layout = this.config.layout[index];
        if (layout) {
          node.element.style.gridRow = layout.row;
          node.element.style.gridColumn = layout.col;
          node.element.style.alignSelf = layout.alignSelf || 'center';
          node.element.style.justifySelf = 'center';
        }
        node.element.dataset.index = index;
      });
    } else if (this.autoLayout) {
      this.nodes.forEach((node, index) => {
        const layout = this.autoLayout[index];
        if (layout) {
          node.element.style.gridRow = `${layout.row}`;
          node.element.style.gridColumn = `${layout.col}`;
          node.element.style.alignSelf = layout.alignSelf;
          node.element.style.justifySelf = 'center';
        }
        node.element.dataset.index = index;
      });
    } else {
      this.nodes.forEach((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        node.element.style.gridRow = row + 1;
        node.element.style.gridColumn = col + 1;
        node.element.style.alignSelf = 'center';
        node.element.style.justifySelf = 'center';
        node.element.dataset.index = index;
      });
    }
  }
  
  findElementById(id) {
    const node = this.nodes.find(n => n.id === id);
    if (node) return node.element;
    return document.getElementById(id) || document.querySelector(id);
  }
  
  createConnections() {
    this.svg.innerHTML = '';
    this.lines = [];
    
    const explicitConnections = this.config && this.config.connections;
    
    if (explicitConnections && explicitConnections.length > 0) {
      explicitConnections.forEach(conn => {
        const fromElement = this.findElementById(conn.from);
        const toElement = this.findElementById(conn.to);
        
        if (fromElement && toElement) {
          const fromNode = this.nodes.find(n => n.id === conn.from);
          const toNode = this.nodes.find(n => n.id === conn.to);
          const fromAnchor = conn.fromAnchor || (fromNode && fromNode.data.lineAnchor) || 'right';
          const toAnchor = conn.toAnchor || (toNode && toNode.data.lineAnchor) || 'left';
          this.createConnectionLine(fromElement, toElement, 'explicit', fromAnchor, toAnchor);
        }
      });
    } else if (this.nodes.length >= 2) {
      this.createAutoConnections();
    }
    
    this.updateAllConnections();
    console.log(`Created ${this.lines.length} connection lines`);
  }
  
  createAutoConnections() {
    const nodeCount = this.nodes.length;
    
    for (let i = 0; i < nodeCount; i += 2) {
      if (i + 1 < nodeCount) {
        const fromNode = this.nodes[i];
        const toNode = this.nodes[i + 1];
        
        const fromEl = fromNode.data.type === 'text' ? fromNode.element : toNode.element;
        const toEl = fromNode.data.type === 'image' ? fromNode.element : toNode.element;
        
        this.createConnectionLine(fromEl, toEl, 'text-image', 'right', 'left');
      }
    }
    
    const imageNodes = this.nodes.filter(n => n.data.type === 'image');
    for (let i = 0; i < imageNodes.length - 1; i++) {
      this.createConnectionLine(imageNodes[i].element, imageNodes[i + 1].element, 'image-image', 'right', 'left');
    }
  }
  
  createConnectionLine(fromElement, toElement, type, fromAnchor = 'right', toAnchor = 'left') {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.classList.add('connection-line');
    line.setAttribute('data-type', type);
    
    this.svg.appendChild(line);
    this.lines.push({
      element: line,
      from: fromElement,
      to: toElement,
      type,
      fromAnchor: fromAnchor,
      toAnchor: toAnchor
    });
  }
  
  getAnchorPoint(element, anchor, svgRect) {
    const rect = element.getBoundingClientRect();
    const x = rect.left - svgRect.left;
    const y = rect.top - svgRect.top;
    
    switch (anchor) {
      case 'left':
        return { x: x, y: y + rect.height / 2 };
      case 'right':
        return { x: x + rect.width, y: y + rect.height / 2 };
      case 'top':
        return { x: x + rect.width / 2, y: y };
      case 'bottom':
        return { x: x + rect.width / 2, y: y + rect.height };
      case 'top-left':
        return { x: x, y: y };
      case 'top-right':
        return { x: x + rect.width, y: y };
      case 'bottom-left':
        return { x: x, y: y + rect.height };
      case 'bottom-right':
        return { x: x + rect.width, y: y + rect.height };
      default:
        return { x: x + rect.width, y: y + rect.height / 2 };
    }
  }
  
  createConnectionsLegacy() {
    const containerGroups = document.querySelectorAll('.container-group');
    
    if (containerGroups.length < 2) {
      console.warn('Not enough container groups found for connections');
      return;
    }
    
    this.svg.innerHTML = '';
    this.lines = [];
    
    containerGroups.forEach((group, groupIndex) => {
      const textContainer = group.querySelector('.text-container');
      const imageContainer = group.querySelector('.image-container');
      
      if (textContainer && imageContainer) {
        const isEvenIndex = groupIndex % 2 === 0;
        const fromContainer = isEvenIndex ? textContainer : imageContainer;
        const toContainer = isEvenIndex ? imageContainer : textContainer;
        
        this.createConnectionLine(fromContainer, toContainer, 'text-image', 'right', 'left');
      }
    });
    
    for (let i = 0; i < containerGroups.length - 1; i++) {
      const currentImage = containerGroups[i].querySelector('.image-container');
      const nextImage = containerGroups[i + 1].querySelector('.image-container');
      
      if (currentImage && nextImage) {
        this.createConnectionLine(currentImage, nextImage, 'image-image', 'right', 'left');
      }
    }
    
    this.updateAllConnections();
  }
  
  updateAllConnections() {
    if (!this.svg || !this.lines.length) return;
    
    const svgRect = this.svg.getBoundingClientRect();
    
    this.lines.forEach(line => {
      const start = this.getAnchorPoint(line.from, line.fromAnchor, svgRect);
      const end = this.getAnchorPoint(line.to, line.toAnchor, svgRect);
      
      // Round to whole pixels so 2px strokes land crisply on the pixel grid
      const pathData = `M ${Math.round(start.x)} ${Math.round(start.y)} L ${Math.round(end.x)} ${Math.round(end.y)}`;
      line.element.setAttribute('d', pathData);
    });
  }
  
  setupEventListeners() {
    // Lines are anchored to element positions, so recompute whenever layout
    // shifts: lazy images finishing loading, fade-in animations ending, or
    // any node/grid resizing.
    const refresh = () => {
      if (this.refreshFrame) return;
      this.refreshFrame = requestAnimationFrame(() => {
        this.refreshFrame = null;
        this.updateAllConnections();
      });
    };
    
    this.nodeContainer.querySelectorAll('img').forEach(img => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });
    this.nodeContainer.addEventListener('animationend', refresh);
    
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(refresh);
      observer.observe(this.nodeContainer);
      this.nodes.forEach(node => observer.observe(node.element));
    }
    
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      
      this.resizeTimeout = setTimeout(() => {
        this.svg.setAttribute('width', window.innerWidth);
        this.svg.setAttribute('height', window.innerHeight);
        this.calculateLayout();
        this.applyLayout();
        this.updateAllConnections();
      }, 150);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const connector = new LinearConnector();
  window.linearConnector = connector;
});
