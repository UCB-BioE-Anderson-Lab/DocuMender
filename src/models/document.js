class Section {
  constructor(name, content = '', children = []) {
    this.name = name;
    this.content = content;
    this.children = children;
  }
}

class Document {
  constructor() {
    this.root = new Section('doc');
  }

findSection(path) {
  console.log(`[findSection] Searching for section with path: ${path}`);
  if (path === 'doc') {
    console.log(`[findSection] Found root section`);
    return this.root;
  }

  // Split the path into parts, but exclude the first part ('doc') since it refers to the root section
  const pathParts = path.split('.').slice(1);
  let currentSection = this.root;

  for (const part of pathParts) {
    console.log(`[findSection] Searching for child with name: ${part}`);
    const child = currentSection.children.find(child => child.name === part);
    if (!child) {
      console.log(`[findSection] Child not found: ${part}`);
      return null; // Section not found
    }
    console.log(`[findSection] Found child: ${part}`);
    currentSection = child;
  }

  console.log(`[findSection] Found section with path: ${path}`);
  return currentSection;
}


  addSection(parentPath, name, content) {
    const parentSection = this.findSection(parentPath);
    if (!parentSection) {
      return null; // Parent section not found
    }

    const newSection = new Section(name, content);
    parentSection.children.push(newSection);
    return newSection;
  }

  updateSection(path, content) {
    const section = this.findSection(path);
    if (!section) {
      return null; // Section not found
    }

    section.content = content;
    return section;
  }



moveSection(sourcePath, destinationPath) {
  // Find the source section to be moved
  const sourceSection = this.findSection(sourcePath);
  if (!sourceSection) {
    return { error: 'Source section not found' };
  }

  // Find the parent of the source section
  const sourceParentPath = sourcePath.split('.').slice(0, -1).join('.');
  const sourceParent = this.findSection(sourceParentPath);
  if (!sourceParent) {
    return { error: 'Source parent section not found' };
  }

  // Find the destination parent section where the source section will be moved to
  const destinationParent = this.findSection(destinationPath);
  if (!destinationParent) {
    return { error: 'Destination section not found' };
  }

  // Remove the source section from its parent's children
  sourceParent.children = sourceParent.children.filter(child => child !== sourceSection);

  // Add the source section to the destination parent's children
  destinationParent.children.push(sourceSection);

  return { message: 'Section moved successfully' };
}



  deleteSection(path) {
    const pathParts = path.split('.');
    const parentPath = pathParts.slice(0, -1).join('.');
    const sectionName = pathParts[pathParts.length - 1];

    const parentSection = this.findSection(parentPath);
    if (!parentSection) {
      return false; // Parent section not found
    }

    const sectionIndex = parentSection.children.findIndex(child => child.name === sectionName);
    if (sectionIndex === -1) {
      return false; // Section not found
    }

    parentSection.children.splice(sectionIndex, 1);
    return true;
  }

  saveAsText(section, level = 0) {
    let text = '';
    const indent = '  '.repeat(level);
    text += `${indent}${section.name}\n`;
    text += `${indent}${section.content}\n`;
    for (const child of section.children) {
      text += this.saveAsText(child, level + 1);
    }
    return text;
  }

}

module.exports = Document;
