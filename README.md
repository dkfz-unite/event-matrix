# Event Matrix

Event Matrix is an instrument for the visual representation of multidimensional data, inspired by the earlier
project [OncoGrid](https://github.com/oncojs/oncogrid). Initially developed to meet the needs of bioinformaticians, it
helps in demonstrating the relationships between genes, donors, and mutations in the genome. It's also well-suited for
displaying any three-dimensional (and potentially four-dimensional) data matrices.

## Installation & Usage

1. Install dependencies:
    ```shell
    npm install dkz-united/event-matrix
    ```
2. Import EventMatrix in your project:
    ```javascript
    import EventMatrix from 'event-matrix';
    ```
3. Set up options:
    ```javascript
    const eventMatrix = new EventMatrix({
      element: '#event-matrix', // HTML ID for mounting the component
      columns, // Columns of your data grid
      rows, // Rows of your data grid
      entries, // Entries/events that occur in a specific cell
      colorMap, // Object where keys represent the entry type and values represent the cell color
      width: 1000, // Table width
    });
    eventMatrix.setGridLines(this.showGridLines);
    eventMatrix.render();
    ```

## Options

| Option               | Default value                               | Example                                                            | Description                                                                             |
|----------------------|---------------------------------------------|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| `element`            | -                                           | "#event-matrix"                                                    | HTML selector for mounting the component                                                |
| `columns`            | []                                          | [{ "id": "12" }]                                                   | Column data                                                                             |
| `rows`               | []                                          | [{ "id": "34" }]                                                   | Row data                                                                                |
| `entries`            | []                                          | [{ "id": "56", "value": "good", "rowId": "34", "columnId": "12" }] | "Events" or "Entries" - data defined by the intersection of a row and a column          |
| `columnFields`       | []                                          | [{ "id": "1234", "fieldName": "age", "name": "User age" }]         | Fields describing column data. This block is located below the table                    |
| `rowFields`          | []                                          | [{ "id": "1234", "fieldName": "age", "name": "User age" }]         | Fields describing row data. This block is located to the right of the table             |
| `colorMap`           | {}                                          | { "good": "#00FF00", "normal": "#FFFF00", "bad": "#FF0000" }       | Cell color in the table depending on the value in the cell (entries)                    |
| `columnsFillFunc`    | () => "black"                               | (val) => (val.name === "red" ? "#FF0000" : "#00FF00")              | Function that determines the cell color in the lower description block                  |
| `columnsOpacityFunc` | () => 1                                     | (val) => Math.max(val.value / 100 + 0.1, 1)                        | Function that determines the cell opacity ("brightness") in the lower description block |
| `rowsFillFunc`       | () => "black"                               | (val) => (val.name === "red" ? "#FF0000" : "#00FF00")              | Function that determines the cell color in the right description block                  |
| `rowsOpacityFunc`    | () => 1                                     | (val) => Math.max(val.value / 100 + 0.1, 1)                        | Function that determines the cell opacity ("brightness") in the right description block |
| `fieldHeight`        | 10                                          | 20                                                                 | Row height in the description block                                                     |
| `width`              | 500                                         | 1000                                                               | Width of the main table                                                                 |
| `fieldLegendLabel`   | undefined                                   | "<i class='las la-question-circle'></i>"                           | HTML icon next to the name of the parameter group in the description block              |
| `margin`             | {top: 30, right: 100, bottom: 15, left: 80} | {top: 0, right: 0, bottom: 0, left: 0}                             | Margins around the component                                                            |

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
- `donorFillFunc` → `columnsFillFunc`
- `geneFillFunc` → `rowsFillFunc`
- `donorOpacityFunc` → `columnsOpacityFunc`
- `geneOpacityFunc` → `rowsOpacityFunc`
- `trackLegendLabel` → `fieldLegendLabel`
- `trackHeight` → `fieldHeight`

2. Update the structure of observations:

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

3. Update events:

- `histogramMouseOver` → `histogram:hover`
- `histogramClick` → `histogram:click`
- `gridMouseOver` → `grid:cell:hover`
- `gridClick` → `grid:cell:click`
- `trackLegendMouseOver` → `description:legend:hover`
- `trackMouseOver` → `description:cell:hover`
- `trackClick` → `description:cell:click`

4. As the component update is still in progress, please feel free to create issues and provide feedback.

## Development

1. Install Node ~18. Using [NVM](https://github.com/nvm-sh/nvm) is recommended.
2. Install dependencies:
    ```shell
    npm install
    ```
