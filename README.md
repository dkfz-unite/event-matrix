<!-- markdownlint-disable MD033 -->
<!-- TODO: MD033/no-inline-html -->

# Event Matrix

Event Matrix is an instrument for the visual representation of multidimensional data, inspired by the earlier
project [OncoGrid](https://github.com/oncojs/oncogrid). Initially developed to meet the needs of bioinformaticians, it
helps in demonstrating the relationships between genes, donors, and mutations in the genome. It's also well-suited for
displaying any three-dimensional (and potentially four-dimensional) data matrices.

## Installation & Usage

1. Install dependencies:

    ```sh
    npm install event-matrix
    ```

1. Import `EventMatrix` in your project:

    ```javascript
    import EventMatrix from 'event-matrix';
    ```

1. Set up options:

    ```javascript
    const eventMatrix = new EventMatrix({
      element: '#event-matrix', // HTML ID for mounting the component
      columns, // Columns of your data grid
      rows, // Rows of your data grid
      entries, // Entries/events that occur in a specific cell
      width: 1000, // You can specify the table width...
      minCellWidth: 30, // ...or you can specify the min cell width
    });
    eventMatrix.setGridLines(this.showGridLines);
    eventMatrix.render();
    ```

## Options

| Option                           | Possible / Default value                    | Example                                                                                | Description                                                                         |
|----------------------------------|---------------------------------------------|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| `element`                        | -                                           | "#event-matrix"                                                                        | HTML selector for mounting the component                                            |
| `columns`                        | Array / []                                  | [{ "id": "12" }]                                                                       | Column data                                                                         |
| `rows`                           | Array / []                                  | [{ "id": "34" }]                                                                       | Row data                                                                            |
| `entries`                        | Array / []                                  | [{ "id": "56", "rowId": "12", "columnId": "34" }]                                      | "Events" or "Entries" - data defined by the intersection of a row and a column      |
| `grid`                           | Object / false / {}                         | { appearance: () => {}, width: 1000, minCellHeight: 15, minCellWidth: 30 }             | Options that describe main grid                                                     |
| `grid.appearance`                | Function                                    | (val) => { color: (val.name === "red" ? "#FF0000" : "#00FF00"), opacity: .5 }          | Function that determines the cell color and opacity in the main grid                |
| `grid.width`                     | Number / 1000                               | 555                                                                                    | You can specify here the main grid total width...                                   |
| `grid.minCellWidth`              | Number / 30                                 | 33.3                                                                                   | ...or specify minimum cell width                                                    |
| `grid.height`                    | Number / 500                                | 250                                                                                    | You can specify here the main grid total height...                                  |
| `grid.minCellHeight`             | Number / 15                                 | 17                                                                                     | ...or specify minimum cell height                                                   |
| `description`                    | Object / false / {}                         | { bottom: false, side: { fields: [] }}                                                 | Options for the bottom and side descriptions blocks                                 |
| `description.side`               | Object / false / {}                         | { fields: [], appearance: () => {}, fieldHeight: 15 }                                  | Options for the side description block (same options for the side block)            |
| `description.bottom`             | Object / false / {}                         | { fields: [], appearance: () => {}, fieldHeight: 15 }                                  | Options for the bottom description block (same options for the bottom block)        |
| `description.bottom.fields`      | Array / []                                  | [{ "group": "Clinical Data", "name": "Age", "fieldName": "age", "type": "age"}]        | Column or row description fields (the param "group" allows divide fields by groups) |
| `description.bottom.appearance`  | Function                                    | (trackCell) => { color: (trackCell.type === 'age' ? "#FF0000" : "#00FF00"), opacity: .5 } | Function that determines the cell color and opacity in this description block       |
| `description.bottom.fieldHeight` | Number / 15                                 | 10                                                                                     | Description field height                                                            |
| `histogram`                      | Object / false / {}                         | { top: false, side: { label: "AAAA" }}                                                 | Options that describe top and side histograms                                       |
| `histogram.side`                 | Object / false / {}                         | { label: "Mutation freq." }                                                             | Options for the side histogram block (same options for the top block)               |
| `histogram.top`                  | Object / false / {}                         | { label: "Mutation freq." }                                                             | Options for the top histogram block (same options for the side block)               |
| `histogram.top.label`            | String / ""                                 | "Mutation freq."                                                               | The histogram's label                                                               |

## Events

| Event                      | Params                                                                       | Description                                                                                               |
|----------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `grid:cell:hover`          | target: HTMLElement,<br/>entryId: string                                     | Hovered over a table cell                                                                                 |
| `grid:cell:click`          | target: HTMLElement,<br/>entryId: string                                     | Clicked on a table cell                                                                                   |
| `grid:out`                 | -                                                                            | Moved cursor away from the table                                                                          |
| `grid:label:hover`         | target: HTMLElement, rowId: string                                           | Hovered over a row label                                                                                  |
| `grid:label:click`         | target: HTMLElement, rowId: string                                           | Clicked on a row label                                                                                    |
| `grid:crosshair:hover`     | target: HTMLElement, columnId: string, rowId: string                         | Hovered over a table cell in zoom mode                                                                    |
| `grid:crosshair:out`       | -                                                                            | Moved cursor away from the table in zoom mode                                                             |
| `grid:selection:started`   | target: HTMLElement, x: number, y: number                                    | Started selecting cells in zoom mode; `x`, `y` - coordinates of the selection start                       |
| `grid:selection:finished`  | target: HTMLElement, x: number, y: number                                    | Finished selecting cells in zoom mode; `x`, `y` - coordinates of the selection end                        |
| `histogram:hover`          | target: HTMLElement, domainId: string, type: "rows"/"columns"                | Hovered over a histogram column; `domainId` - id of a row or column, depending on the `type` of histogram |
| `histogram:click`          | target: HTMLElement, domainId: string, type: "rows"/"columns"                | Clicked on a histogram column; `domainId` - id of a row or column, depending on the `type` of histogram   |
| `histogram:out`            | -                                                                            | Moved cursor away from the histogram                                                                      |
| `description:legend:hover` | target: HTMLElement, group: string                                           | Hovered over an icon in the description block; `group` - the name of the group                            |
| `description:legend:out`   | -                                                                            | Moved cursor away from an icon in the description block                                                   |
| `description:cell:hover`   | target: HTMLElement, domainId: string, type: "rows"/"columns", field: string | Hovered over a cell in the description block; `domainId` - id of a row or column, `field` - name of field |
| `description:cell:click`   | target: HTMLElement, domainId: string, type: "rows"/"columns", field: string | Clicked on a cell in the description block; `domainId` - id of a row or column, `field` - name of field   |
| `description:cell:out`     | -                                                                            | Moved cursor away from the description block                                                              |

## Migration from OncoGrid

If you previously used OncoGrid, you might want to switch to this newer version. Note that there have been changes in
parameter, function, and event names.

1. Update options:

- `genes` → `rows`
- `donors` → `columns`
- `observations` → `entries`
- `donorTracks` → `columnFields`
- `geneTracks` → `rowFields`
- `donorOpacityFunc` + `donorFillFunc` → `description.bottom.appearance`
- `geneOpacityFunc` + `geneFillFunc` → `description.side.appearance`
- `colorMap` (Map) → `grid.appearance` (Function)
- `trackLegendLabel` → `fieldLegendLabel`
- `trackHeight` → `fieldHeight`

1. Update the structure of observations:

- Before:

  ```json
  {
    "geneId": "1234",
    "donorId": "5678"
  }
  ```

- After:

  ```json
  {
    "rowId": "1234",
    "columnId": "5678"
  }
  ```

1. Update events:

- `histogramMouseOver` → `histogram:hover`
- `histogramClick` → `histogram:click`
- `gridMouseOver` → `grid:cell:hover`
- `gridClick` → `grid:cell:click`
- `trackLegendMouseOver` → `description:legend:hover`
- `trackMouseOver` → `description:cell:hover`
- `trackClick` → `description:cell:click`

1. As the component update is still in progress, please feel free to create issues and provide feedback.

## Development

1. Install Node ~18. Using [NVM](https://github.com/nvm-sh/nvm) is recommended.
2. Install dependencies:

    ```sh
    npm install
    ```

## Contribution guidelines

The project uses [pre-commit.com](https://pre-commit.com/) hooks. Run `brew install pre-commit && pre-commit install`
for automatic configuration.
