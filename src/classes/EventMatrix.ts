import * as d3 from 'd3';
import cloneDeep from 'lodash.clonedeep';
import MainGrid from './MainGrid';
import values from 'lodash.values';
import EventEmitter from 'eventemitter3';
import util from 'util';
import {EventMatrixParams} from "../interfaces/main-grid.interfaces";

class EventMatrix extends EventEmitter {
    private params: EventMatrixParams;
    private inputWidth: number;
    private width: number;
    private minCellHeight: number;
    private inputHeight: number;
    private height: number;
    private prefix: string;
    private container: any;
    private clonedParams: EventMatrixParams;
    private donors: any[];
    private genes: any[];
    private ssmObservations: any[];
    private cnvObservations: any[];
    private observations: any[];
    private types: string[];
    private lookupTable: any;
    private mainGrid: any;
    private heatMapMode: boolean;
    private drawGridLines: boolean;
    private crosshairMode: boolean;
    private charts: any[];
    private x: any;
    private y: any;

    constructor(params: EventMatrixParams) {
        super();
        this.params = params;
        this.inputWidth = params.width || 500;
        this.width = this.inputWidth;
        this.minCellHeight = params.minCellHeight || 10;
        this.inputHeight = params.height || 500;
        this.height = this.inputHeight;
        if (this.height / params.genes.length < this.minCellHeight) {
            this.height = params.genes.length * this.minCellHeight;
        }
        this.prefix = params.prefix || 'og-';
        params.wrapper = '.' + this.prefix + 'container';
        this.container = d3.select(params.element || 'body')
            .append('div')
            .attr('class', this.prefix + 'container')
            .style('position', 'relative');
        this.initCharts();
    }

    /**
     * Instantiate charts
     */
    private initCharts(reloading?: boolean) {
        this.clonedParams = cloneDeep(this.params);
        this.donors = this.clonedParams.donors || [];
        this.genes = this.clonedParams.genes || [];
        this.ssmObservations = this.clonedParams.ssmObservations || [];
        this.cnvObservations = this.clonedParams.cnvObservations || [];
        this.observations = this.clonedParams.observations || [];
        this.types = [];
        if (this.cnvObservations.length) { this.types.push('cnv'); }
        if (this.observations.length) { this.types.push('mutation'); }
        this.createLookupTable();
        this.computeDonorCounts();
        this.computeGeneScoresAndCount();
        this.genesSortbyScores();
        this.computeScores();
        this.sortByScores();
        this.calculatePositions();
        if(reloading) {
            this.clonedParams.width = this.width;
            this.clonedParams.height = this.height;
        }
        this.mainGrid = new MainGrid(this.clonedParams, this.lookupTable, this.update(this), () => {
            this.resize(this.width, this.height, this.fullscreen);
        }, this.x, this.y);
        this.heatMapMode = this.mainGrid.heatMap;
        this.drawGridLines = this.mainGrid.drawGridLines;
        this.crosshairMode = this.mainGrid.crosshair;
        this.charts = [];
        this.charts.push(this.mainGrid);
    }

    private calculatePositions() {
        const getX = d3.scale.ordinal()
            .domain(d3.range(this.donors.length))
            .rangeBands([0, this.width]);
        for (let t = 0, type; t < this.types.length; t++) {
            type = this.types[t];
            for(let i = 0, donor, donorId, x; i < this.donors.length; i += 1) {
                donor = this.donors[i];
                donorId = donor.id;
                x = getX(i);
                donor.x = x;
                this.lookupTable[donorId] = this.lookupTable[donorId] || {};
                this.lookupTable[donorId].x = x;
            }
        }
        const getY = d3.scale.ordinal()
            .domain(d3.range(this.genes.length))
            .rangeBands([0, this.height]);
        for(let i = 0; i < this.genes.length; i += 1) {
            this.genes[i].y = getY(i);
        }
        this.y = getY;
        this.x = getX;
    }

    /**
     * Creates a for constant time checks if an observation exists for a given donor, gene coordinate.
     */
    private createLookupTable() {
        const lookupTable = {};
        for (let i = 0; i < this.observations.length; i++) {
            const obs = this.observations[i];
            const donorId = obs.donorId;
            const geneId = obs.geneId;
            if (lookupTable.hasOwnProperty(donorId)) {
                if (lookupTable[donorId].hasOwnProperty(geneId)) {
                    lookupTable[donorId][geneId].push(obs.id);
                } else {
                    lookupTable[donorId][geneId] = [obs.id];
                }
            } else {
                lookupTable[donorId] = {};
                lookupTable[donorId][geneId] = [obs.id];
            }
        }
        this.lookupTable = lookupTable;
    }

    /**
     * Initializes and creates the main SVG with rows and columns. Does prelim sort on data
     */
    public render() {
        this.emit('render:all:start');
        setTimeout(() => {
            this.charts.forEach((chart) => {
                chart.render();
            });
            this.emit('render:all:end');
        });
    }

    /**
     * Updates all charts
     */
    private update(scope) {
        const _self = scope;
        return function(donorSort) {
            donorSort = (typeof donorSort === 'undefined' || donorSort === null) ? false: donorSort;
            if (donorSort) {
                _self.computeScores();
                _self.sortByScores();
            }
            _self.calculatePositions();
            _self.charts.forEach((chart) => {
                chart.update(_self.x, _self.y);
            });
        };
    }

    /**
     * Triggers a resize of OncoGrid to desired width and height.
     */
    public resize(width, height, fullscreen) {
        this.fullscreen = fullscreen;
        this.mainGrid.fullscreen = fullscreen;
        this.width = Number(width);
        this.height = Number(height);
        if (this.height / this.genes.length < this.minCellHeight) {
            this.height = this.genes.length * this.minCellHeight;
        }
        this.calculatePositions();
        this.charts.forEach((chart) => {
            chart.fullscreen = fullscreen;
            chart.resize(this.width, this.height, this.x, this.y);
        });
    }

    /**
     * Sorts donors by score
     */
    private sortByScores() {
        this.donors.sort(this.sortScore);
    }

    private genesSortbyScores() {
        this.genes.sort(this.sortScore);
    }

    /**
     * Sorts genes by scores and recomputes and sorts donors.
     * Clusters towards top left corner of grid.
     */
    public cluster() {
        this.genesSortbyScores();
        this.computeScores();
        this.sortByScores();
        this.update(this)();
    }

    public removeDonors(func) {
        const removedList = [];
        // Remove donors from data
        for (let i = 0; i < this.donors.length; i++) {
            const donor = this.donors[i];
            if (func(donor)) {
                removedList.push(donor.id);
                d3.selectAll('.' + this.prefix + donor.id + '-cell').remove();
                d3.selectAll('.' + this.prefix + donor.id + '-bar').remove();
                this.donors.splice(i, 1);
                i--;
            }
        }
        for (let j = 0; j < this.observations.length; j++) {
            const obs = this.observations[j];
            if (this.donors.indexOf(obs.id) >= 0) {
                this.observations.splice(j, 1);
                j--;
            }
        }
        this.computeGeneScoresAndCount();
        this.update(this)();
        this.resize(this.width, this.height, false);
    }

    /**
     * Removes genes and updates OncoGrid rendering.
     * @param func function describing the criteria for removing a gene.
     */
    public removeGenes(func) {
        const removedList = [];
        // Remove genes from data
        for (let i = 0; i < this.genes.length; i++) {
            const gene = this.genes[i];
            if (func(gene)) {
                removedList.push(gene.id);
                d3.selectAll('.' + this.prefix + gene.id + '-cell').remove();
                d3.selectAll('.' + this.prefix + gene.id + '-bar').remove();
                this.genes.splice(i, 1);
                i--;
            }
        }
        this.update(this)();
        this.resize(this.width, this.height, false);
    }

    /**
     * Sorts donors
     * @param func a comparator function.
     */
    public sortDonors(func) {
        this.donors.sort(func);
        this.update(this)();
    }

    /**
     * Sorts genes
     * @param func a comparator function.
     */
    public sortGenes(func) {
        this.computeScores();
        this.sortByScores();
        this.genes.sort(func);
        this.update(this)();
    }

    /**
     * set oncogrid between heatmap mode and regular mode showing individual consequence types.
     */
    public setHeatmap(active) {
        this.heatMapMode = active;
        this.mainGrid.setHeatmap(active);
    }

    /**
     * Toggles oncogrid between heatmap mode and regular mode showing individual consequence types.
     */
    public toggleHeatmap() {
        this.setHeatmap(!this.heatMapMode);
    }

    public setGridLines(active) {
        this.drawGridLines = active;
        this.mainGrid.setGridLines(active);
    }

    public toggleGridLines() {
        this.setGridLines(!this.drawGridLines);
    }

    public setCrosshair(active) {
        this.crosshairMode = active;
        this.mainGrid.setCrosshair(active);
    }

    public toggleCrosshair() {
        this.setCrosshair(!this.crosshairMode);
    }

    /**
     * Returns 1 if at least one mutation, 0 otherwise.
     */
    private mutationScore(donor, gene) {
        if (this.lookupTable.hasOwnProperty(donor) && this.lookupTable[donor].hasOwnProperty(gene)) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Returns # of mutations a gene has as it's score
     */
    private mutationGeneScore(donor, gene) {
        if (this.lookupTable.hasOwnProperty(donor) && this.lookupTable[donor].hasOwnProperty(gene)) {
            // genes are in nested arrays in the lookup table, need to flatten to get the correct count
            const totalGenes = [].concat.apply([], this.lookupTable[donor][gene]);
            return totalGenes.length;
        } else {
            return 0;
        }
    }

    /**
     * Computes scores for donor sorting.
     */
    private computeScores() {
        for (let i = 0; i < this.donors.length; i++) {
            const donor = this.donors[i];
            donor.score = 0;
            for (let j = 0; j < this.genes.length; j++) {
                const gene = this.genes[j];
                donor.score += (this.mutationScore(donor.id, gene.id) * Math.pow(2, this.genes.length + 1 - j));
            }
        }
    }

    /**
     * Computes scores for gene sorting.
     */
    private computeGeneScoresAndCount() {
        for (let i = 0; i < this.genes.length; i++) {
            const gene = this.genes[i];
            gene.score = 0;
            for (let j = 0; j < this.donors.length; j++) {
                const donor = this.donors[j];
                gene.score += this.mutationGeneScore(donor.id, gene.id);
            }
            gene.count = gene.score;
        }
    }

    /**
     * Computes the number of observations for a given donor.
     */
    private computeDonorCounts() {
        for (let i = 0; i < this.donors.length; i++) {
            const donor = this.donors[i];
            const genes = [].concat.apply([], values(this.lookupTable[donor.id] || {}));
            donor.count = 0;
            for(let j = 0; j < genes.length; j++) {
                donor.count += genes[j].length;
            }
        }
    }

    /**
     * Computes the number of observations for a given gene.
     */
    private computeGeneCounts() {
        for (let i = 0; i < this.genes.length; i++) {
            const gene = this.genes[i];
            gene.count = 0;
            for (let j = 0; j < this.observations.length; j++) {
                const obs = this.observations[j];
                if (gene.id === obs.geneId) {
                    gene.count+= 1;
                }
            }
        }
    }

    /**
     * Comparator for scores
     */
    private sortScore(a, b) {
        if (a.score < b.score) {
            return 1;
        } else if (a.score > b.score) {
            return -1;
        } else {
            return a.id >= b.id ? 1: -1;
        }
    }

    /**
     *  Cleanup function to ensure the svg and any bindings are removed from the dom.
     */
    public destroy() {
        this.charts.forEach((chart) => {
            chart.destroy();
        });
        this.container.remove();
    }

    public reload() {
        this.charts.forEach((chart) => {
            chart.destroy();
        });
        this.initCharts(true);
        this.render();
    }
}

export default EventMatrix;
