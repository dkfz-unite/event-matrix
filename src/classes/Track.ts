import TrackGroup from './TrackGroup';
import {OncoTrackParams} from "../interfaces/main-grid.interfaces";

class Track {
    emit: any;
    padding: number;
    offset: any;
    params: OncoTrackParams;
    prefix: string;
    svg: any;
    rotated: boolean;
    updateCallback: any;
    resizeCallback: any;
    expandableGroups: any[];
    isFullscreen: boolean;
    trackLegendLabel: any;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    domain: any[];
    width: number;
    cellHeight: number;
    numDomain: number;
    cellWidth: number;
    availableTracks: any[];
    opacityFunc: any;
    fillFunc: any;
    drawGridLines: boolean;
    nullSentinel: number;
    groupMap: any;
    groups: TrackGroup[];
    container: any;
    height: number;

    constructor(
        params: OncoTrackParams,
        s: any,
        rotated: boolean,
        tracks: any[],
        opacityFunc: any,
        fillFunc: any,
        updateCallback: any,
        offset: any,
        resizeCallback: any,
        isFullscreen: boolean
    ) {
        const _self = this;
        _self.emit = params.emit;
        _self.padding = params.trackPadding || 20;
        _self.offset = offset;
        _self.params = params;
        _self.prefix = params.prefix || 'og-';
        _self.svg = s;
        _self.rotated = rotated || false;
        _self.updateCallback = updateCallback;
        _self.resizeCallback = resizeCallback;
        _self.expandableGroups = params.expandableGroups || [];

        _self.isFullscreen = isFullscreen;

        _self.trackLegendLabel = params.trackLegendLabel;

        _self.margin = params.margin || { top: 30, right: 15, bottom: 15, left: 80 };

        _self.domain = (_self.rotated ? params.genes : params.donors) || [];

        _self.width = (_self.rotated ? params.height : params.width) || 500;

        _self.cellHeight = params.trackHeight || 10;
        _self.numDomain = _self.domain.length;
        _self.cellWidth = _self.width / _self.numDomain;

        _self.availableTracks = tracks || [];
        _self.opacityFunc = opacityFunc;
        _self.fillFunc = fillFunc;
        _self.drawGridLines = params.grid || false;

        _self.nullSentinel = params.nullSentinel || -777;

        _self.parseGroups();
    }

    /**
     * Parses track groups out of input.
     */
    parseGroups(): void {
        const _self = this;

        _self.groupMap = {}; // Nice for lookups and existence checks
        _self.groups = []; // Nice for direct iteration
        _self.availableTracks.forEach(function (track) {
            const group = track.group || 'Tracks';
            if (_self.groupMap.hasOwnProperty(group)) {
                _self.groupMap[group].addTrack(track);
            } else {
                const trackGroup = new TrackGroup(
                    {
                        emit: _self.emit,
                        cellHeight: _self.cellHeight,
                        width: _self.width,
                        grid: _self.drawGridLines,
                        nullSentinel: _self.nullSentinel,
                        domain: _self.domain,
                        trackLegendLabel: _self.trackLegendLabel,
                        expandable: _self.expandableGroups.indexOf(group) >= 0,
                        wrapper: _self.params.wrapper,
                    },
                    group,
                    _self.rotated,
                    _self.opacityFunc,
                    _self.fillFunc,
                    _self.updateCallback,
                    _self.resizeCallback,
                    _self.isFullscreen
                );
                trackGroup.addTrack(track);
                _self.groupMap[group] = trackGroup;
                _self.groups.push(trackGroup);
            }
        });
    }

    /**
     * Initializes the track group data and places container for each group in spaced
     * intervals.
     */
    init(): void {
        const _self = this;
        _self.container = _self.svg.append('g');

        const labelHeight = _self.rotated ? 16.5 : 0;
        _self.height = 0;
        for (let k = 0; k < _self.groups.length; k++) {
            const g = _self.groups[k];
            const trackContainer = _self.container.append('g').attr('transform', 'translate(0,' + _self.height + ')');
            g.init(trackContainer);
            _self.height += Number(g.totalHeight) + _self.padding;
        }

        const translateDown = _self.rotated ? -(_self.offset + _self.height) : _self.padding + _self.offset;

        _self.container
            .attr('width', _self.width)
            .attr('height', _self.height)
            .attr('class', _self.prefix + 'track')
            .attr('transform', function () {
                return (_self.rotated ? 'rotate(90)' : '') + 'translate(0,' + translateDown + ')';
            });

        _self.height += labelHeight;
    }

    /** Calls render on all track groups */
    render(): void {
        const _self = this;

        for (let i = 0; i < _self.groups.length; i++) {
            const g = _self.groups[i];
            g.render();
        }
    }

    /** Resizes all the track groups */
    resize(width: number, height: number, offset: any): void {
        const _self = this;

        _self.offset = offset || _self.offset;
        _self.width = _self.rotated ? height : width;
        _self.height = 0;
        const labelHeight = _self.rotated ? 16.5 : 0;

        for (let k = 0; k < _self.groups.length; k++) {
            const g = _self.groups[k];
            g.container.attr('transform', 'translate(0,' + _self.height + ')');
            g.resize(_self.width);
            _self.height += Number(g.totalHeight) + _self.padding;
        }

        const translateDown = _self.rotated ? -(_self.offset + _self.height) : _self.padding + _self.offset;

        _self.container
            .attr('width', _self.width)
            .attr('height', _self.height)
            .attr('transform', function () {
                return (_self.rotated ? 'rotate(90)' : '') + 'translate(0,' + translateDown + ')';
            });

        _self.height += labelHeight;
    }

    /**
     * Updates the rendering of the tracks.
     */
    update(domain: any[]): void {
        const _self = this;

        _self.domain = domain;

        for (let i = 0; i < _self.groups.length; i++) {
            const g = _self.groups[i];
            g.update(domain);
        }
    }

    setGridLines(active: boolean): void {
        const _self = this;

        for (let i = 0; i < _self.groups.length; i++) {
            const g = _self.groups[i];
            g.setGridLines(active);
        }
    }
}

export default Track;
