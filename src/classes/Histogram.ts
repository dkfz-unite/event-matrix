import * as d3 from 'd3';
import {Domain, HistogramParams} from "../interfaces/main-grid.interfaces";

class Histogram {
    private lineWidthOffset: number;
    private lineHeightOffset: number;
    private padding: number;
    private centerText: number;
    private prefix: string;
    private emit: Function;
    private svg: any;
    private rotated: boolean;
    private type: string;
    private domain: Domain[];
    private margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    private width: number;
    private height: number;
    private histogramWidth: number;
    private histogramHeight: number;
    private numDomain: number;
    private barWidth: number;
    private totalHeight: number;
    private wrapper: any;
    private topCount: number;
    private container: any;
    private histogram: any;
    private bottomAxis: any;
    private leftAxis: any;
    private topText: any;
    private middleText: any;
    private leftLabel: any;

    constructor(params: HistogramParams, s: any, rotated?: boolean, type?: string) {
        this.lineWidthOffset = params.histogramBorderPadding?.left || 10;
        this.lineHeightOffset = params.histogramBorderPadding?.bottom || 5;
        this.padding = 20;
        this.centerText = -6;
        this.prefix = params.prefix || 'og-';
        this.emit = params.emit;
        this.svg = s;
        this.rotated = rotated || false;
        this.type = type || 'mutation';
        this.domain = (this.rotated ? params.genes : params.donors) || [];
        this.margin = params.margin || { top: 30, right: 15, bottom: 15, left: 80 };
        this.width = params.width || 500;
        this.height = params.height || 500;
        this.histogramWidth = this.rotated ? this.height : this.width;
        this.histogramHeight = 80;
        this.numDomain = this.domain.length;
        this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length;
        this.totalHeight = this.histogramHeight + this.lineHeightOffset + this.padding + (this.type === 'cnv' ? 120 : 0);
        this.wrapper = d3.select(params.wrapper || 'body');
    }

    public render(): void {
        const topCount = this.getLargestCount(this.domain, this.type);
        this.topCount = topCount;

        this.container = this.svg.append('g')
            .attr('class', this.prefix + 'histogram')
            .attr('width', () => {
                if (this.rotated) {
                    return this.height;
                } else {
                    return this.width + this.margin.left + this.margin.right;
                }
            })
            .attr('height', this.histogramHeight)
            .style('margin-left', this.margin.left + 'px')
            .attr('transform', () => {
                if (this.rotated) {
                    return 'rotate(90)translate(0,-' + (this.width) + ')';
                } else {
                    return '';
                }
            });

        this.histogram = this.container.append('g')
            .attr('transform', 'translate(0,-' + (this.totalHeight + this.centerText) + ')');

        this.renderAxis(topCount);

        this.histogram
            .on('mouseover', () => {
                const target = d3.event.target;
                const domain = this.domain[target.dataset.domainIndex];
                if (!domain) return;
                this.emit((this.type === 'cnv' ? 'cnvHistogramMouseOver' : 'histogramMouseOver'), { domain: domain });
            })
            .on('mouseout', () => {
                this.emit('histogramMouseOut');
            })
            .on('click', () => {
                const target = d3.event.target;
                const domain = this.domain[target.dataset.domainIndex];
                if (!domain) return;
                this.emit('histogramClick', {
                    type: this.rotated ? 'gene' : 'donor',
                    domain: domain,
                });
            });

        this.histogram.selectAll('rect')
            .data(this.domain)
            .enter()
            .append('rect')
            .attr('class', (d: Domain) => {
                return this.prefix + 'sortable-bar ' + this.prefix + d.id + '-bar';
            })
            .attr('data-domain-index', (d: Domain, i: number) => i)
            .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
            .attr('height', (d: Domain) => {
                return this.histogramHeight * (this.type === 'cnv' ? d.cnv : d.count) / topCount;
            })
            .attr('x', (d: Domain) => {
                return this.rotated ? d.y : d.x;
            })
            .attr('y', (d: Domain) => {
                return this.histogramHeight - this.histogramHeight * (this.type === 'cnv' ? d.cnv : d.count) / topCount;
            })
            .attr('fill', '#1693C0');
    }

    public update(domain: Domain[]): void {
        this.domain = domain;
        this.barWidth = (this.rotated ? this.height : this.width) / this.domain.length;

        const topCount = this.topCount || this.getLargestCount(this.domain);

        this.updateAxis(topCount);

        this.histogram.selectAll('rect')
            .data(this.domain)
            .attr('data-domain-index', (d: Domain, i: number) => i)
            .transition()
            .attr('width', this.barWidth - (this.barWidth < 3 ? 0 : 1)) // If bars are small, do not use whitespace.
            .attr('height', (d: Domain) => {
                return this.histogramHeight * (this.type === 'cnv' ? d.cnv : d.count) / topCount;
            })
            .attr('y', (d: Domain) => {
                return this.histogramHeight - this.histogramHeight * (this.type === 'cnv' ? d.cnv : d.count) / topCount;
            })
            .attr('x', (d: Domain) => {
                return this.rotated ? d.y : d.x;
            });
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;

        this.histogramWidth = this.rotated ? this.height : this.width;
        this.container
            .attr('width', () => {
                if (this.rotated) {
                    return this.height;
                } else {
                    return this.width + this.margin.left + this.margin.right;
                }
            })
            .attr('transform', () => {
                if (this.rotated) {
                    return 'rotate(90)translate(0,-' + (this.width) + ')';
                } else {
                    return '';
                }
            });

        this.histogram
            .attr('transform', 'translate(0,-' + (this.totalHeight + this.centerText) + ')');

        this.bottomAxis.attr('x2', this.histogramWidth + 10);
    }

    private renderAxis(topCount: number): void {
        this.bottomAxis = this.histogram.append('line')
            .attr('class', this.prefix + 'histogram-axis');

        this.leftAxis = this.histogram.append('line')
            .attr('class', this.prefix + 'histogram-axis');

        this.topText = this.histogram.append('text')
            .attr('class', this.prefix + 'label-text-font')
            .attr('dy', '.32em')
            .attr('text-anchor', 'end');

        this.middleText = this.histogram.append('text')
            .attr('class', this.prefix + 'label-text-font')
            .attr('dy', '.32em')
            .attr('text-anchor', 'end');

        this.leftLabel = this.histogram.append('text')
            .text(this.type === 'cnv' ? "CNV freq." : "Mutation freq.")
            .attr({
                'class': this.prefix + 'label-text-font',
                'text-anchor': 'middle',
                transform: 'rotate(-90)',
            });

        this.updateAxis(topCount);
    }

    private updateAxis(topCount: number): void {
        this.bottomAxis
            .attr('y1', this.histogramHeight + this.lineHeightOffset)
            .attr('y2', this.histogramHeight + this.lineHeightOffset)
            .attr('x2', this.histogramWidth + this.lineWidthOffset)
            .attr('transform', 'translate(-' + this.lineHeightOffset + ',0)');

        this.leftAxis
            .attr('y1', 0)
            .attr('y2', this.histogramHeight + this.lineHeightOffset)
            .attr('transform', 'translate(-' + this.lineHeightOffset + ',0)');

        this.topText
            .attr('x', this.centerText)
            .text(topCount);

        // Round to a nice round number and then adjust position accordingly
        const halfInt = parseInt(String(topCount / 2));
        const secondHeight = this.histogramHeight - this.histogramHeight / (topCount / halfInt);

        this.middleText
            .attr('x', this.centerText)
            .attr('y', secondHeight)
            .text(halfInt);

        this.leftLabel
            .attr({
                x: -this.histogramHeight / 2,
                y: -this.lineHeightOffset - this.padding,
            });
    }

    private getLargestCount(domain: Domain[], type?: string): number {
        let retVal = 1;

        for (let i = 0; i < domain.length; i++) {
            retVal = Math.max(retVal, type === 'cnv' ? domain[i].cnv : domain[i].count);
        }

        return retVal;
    }

    public destroy(): void {
        this.histogram.remove();
        this.container.remove();
    }
}

export default Histogram;
