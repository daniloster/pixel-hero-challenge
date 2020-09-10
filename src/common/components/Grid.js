import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'

const className = new CSS('grid')
className.scope('--border-width: 0;')
className.scope('--row-width: 100%;')
className.scope('--row-max-width: unset;')
className.scope('overflow: auto;')
className.scope(
  '.grid-wrapper-row',
  `
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: var(--row-width);
  max-width: var(--row-max-width);
`,
)
className.scope(
  '> * > .grid-wrapper-row:last-child',
  'border-bottom: var(--border-width) solid var(--border-color);',
)
className.scope(
  '> * > .grid-wrapper-row:first-child',
  'border-top: var(--border-width) solid var(--border-color);',
)
className.scope('.grid-wrapper-nested', 'width: 100%;')
className.scope('.grid-wrapper-nested .grid-wrapper-cell', 'padding: 0;')
className.scope('.grid-content-cell:last-child', 'height: 100%;')
className.scope(
  '> * > .grid-wrapper-row:first-child > .grid-wrapper-cell > .grid-content-cell',
  'border-top: 0;',
)
className.scope(
  '.grid-content-cell',
  `
  position: relative;
  width: 100%;
  padding: 6px;
  border-top: var(--border-width) solid var(--border-color);
  border-left: var(--border-width) solid var(--border-color);
  background-color: var(--cell-color);
`,
)
className.scope('.grid-content-cell:last-child', 'height: 100%;')
className.scope(
  '.grid-content-cell.sorted',
  'background-color: var(--cell-highlight-color);',
)
const pseudoBorders = `
  display: block;
  content: "";
  position: absolute;
  width: var(--border-width);
  top: calc(var(--border-width) * -1);
  bottom: calc(var(--border-width) * -1);
  z-index: 1;
  background-color: var(--border-highlight-color);
`
className.scope(
  '.grid-content-cell.sorted:before',
  `
  ${pseudoBorders}
  left: calc(var(--border-width) * -1);
`,
)
className.scope(
  '.grid-content-cell.sorted:after',
  `
  ${pseudoBorders}
  right: calc(var(--border-width) * -1);
`,
)

/**
 * Creates a grid based on column definitions and data
 * @param {import('../types').GridProps} props
 */
export default function Grid(props) {
  const {
    data,
    columns,
    borderWidth = 0,
    borderColor = 'transparent',
    borderHighlightColor = 'transparent',
    cellColor = 'transparent',
    cellHighlightColor = 'transparent',
    rowWidth = null,
    rowMaxWidth = null,
    initialSortedById = null,
    rowRenderer = defaultRowRenderer,
    cellRenderer = defaultCellRenderer,
    defaultWidth = 100,
  } = props
  const sortedBy = ObservableState.create(initialSortedById)
  const onSort = (e) => {
    sortedBy.set(() => e.currentTarget.getAttribute('data-column-id'))
  }
  const columnRenderer = ({
    column,
    contentRendererIndex = 'content',
    rowData,
  }) =>
    cellRenderer({
      rowData,
      column,
      contentRendererIndex,
      columnRenderer,
      sortedBy,
      onSort,
      rowRenderer,
      defaultWidth,
    })
  return new Component('div', {
    className,
    style: {
      '--border-width': `${borderWidth}px`,
      '--border-color': borderColor,
      '--border-highlight-color': borderHighlightColor,
      '--cell-color': cellColor,
      '--cell-highlight-color': cellHighlightColor,
      ...(rowWidth === null && { '--row-width': rowWidth }),
      ...(rowMaxWidth === null && { '--row-max-width': rowMaxWidth }),
    },
    children: [
      new Headers({ columns, columnRenderer }),
      new Body({
        columns,
        data,
        rowRenderer,
        columnRenderer,
        sortedBy,
        onSort,
        defaultWidth,
      }),
    ],
  })
}

function Headers({ columns, columnRenderer }) {
  return new Component('div', {
    className: className.for('grid-wrapper-headers'),
    children: [
      new Component('div', {
        className: className.for('grid-wrapper-row head'),
        children: columns.map((column) =>
          columnRenderer({
            column,
            contentRendererIndex: 'head',
          }),
        ),
      }),
    ],
  })
}

function Body({
  columns,
  data,
  rowRenderer,
  columnRenderer,
  sortedBy,
  onSort,
  defaultWidth,
}) {
  return new Component('div', {
    className: className.for('grid-wrapper-body'),
    children: ObservableState.observeTransform([data], (rows) =>
      rows.map((rowData, rowIndex) =>
        rowRenderer({
          rowData,
          index: rowIndex,
          columns,
          columnRenderer,
          contentRendererIndex: 'content',
          sortedBy,
          onSort,
          defaultWidth,
        }),
      ),
    ),
  })
}

function defaultCellRenderer({
  column,
  columnRenderer,
  contentRendererIndex,
  index,
  rowData,
  sortedBy,
  onSort,
  rowRenderer,
  defaultWidth,
}) {
  const content = column[contentRendererIndex]({ rowData, sortedBy })
  return new Component('div', {
    key: `cell-${column.id}`,
    className: `${className.for('grid-wrapper-cell')} ${contentRendererIndex}`,
    style: { width: calculateWidth(column, defaultWidth) },
    children: [
      new Component('div', {
        className: ObservableState.observeTransform(
          sortedBy,
          (sortedById) =>
            `${className.for('grid-content-cell')} ${
              sortedById === column.id && className.for('sorted')
            }`,
        ),
        attrs: { 'data-column-id': column.id },
        events: contentRendererIndex === 'head' ? { click: onSort } : {},
        children: typeof content === 'string' ? content : [content],
      }),
      renderChildren({
        column,
        contentRendererIndex,
        rowData,
        sortedBy,
        onSort,
        rowRenderer,
        columnRenderer,
        defaultWidth,
      }),
    ],
  })
}

function defaultRowRenderer({ rowData, index = 0, columns, columnRenderer }) {
  return new Component('div', {
    key: rowData.id,
    className: className.for('grid-wrapper-row'),
    children: columns.map((column) =>
      columnRenderer({
        rowData,
        column,
      }),
    ),
  })
}

function renderChildren({
  rowData,
  column,
  contentRendererIndex,
  columnRenderer,
  rowRenderer,
  sortedBy,
  onSort,
  defaultWidth,
}) {
  const hasChildren = column?.children?.length > 0
  if (!hasChildren) {
    return new Component('div')
  }

  return new Component('div', {
    className: className.for('grid-wrapper-nested'),
    children: [
      rowRenderer({
        rowData,
        columns: column.children,
        contentRendererIndex,
        columnRenderer,
        rowRenderer,
        sortedBy,
        onSort,
        defaultWidth,
      }),
    ],
  })
}

function calculateWidth(column, defaultWidth = 100) {
  if (column?.children?.length > 0) {
    return column.children.reduce(
      (totalWidth, columnDef) =>
        totalWidth + calculateWidth(columnDef, defaultWidth),
      0,
    )
  }

  return column.width || defaultWidth
}
