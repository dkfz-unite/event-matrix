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

## Options

TBD (To Be Determined)

## Events

TBD (To Be Determined)

## Development

1. Install Node ~18. Using [NVM](https://github.com/nvm-sh/nvm) is recommended.
2. Install dependencies:
    ```shell
    npm install
    ```
