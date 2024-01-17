export interface MainGridParams {
    emit: Function;
    scaleToFit?: boolean;
    leftTextWidth?: number;
    prefix?: string;
    minCellHeight?: number;
    donors?: any[];
    genes?: any[];
    ssmObservations?: any[];
    cnvObservations?: any[];
    wrapper?: string;
    colorMap?: any;
    width?: number;
    height?: number;
    margin?: { top: number, right: number, bottom: number, left: number };
    heatMap?: boolean;
    grid?: boolean;
    heatMapColor?: string;
}

export interface HistogramParams {
    histogramBorderPadding?: {
        left?: number;
        bottom?: number;
    };
    prefix?: string;
    emit: Function;
    svg: any;
    rotated?: boolean;
    type?: string;
    genes?: Domain[];
    donors?: Domain[];
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    width?: number;
    height?: number;
    wrapper?: string;
}

export interface Domain {
    cnv: number;
    count: number;
    displayId?: string;
    symbol?: string;
    id: string;
    x: number;
    y: number;
}

export interface EventMatrixParams {
    emit: Function;
    width?: number;
    minCellHeight?: number;
    height?: number;
    prefix?: string;
    wrapper: string;
    element?: string;
    donors?: any[];
    genes?: any[];
    ssmObservations?: any[];
    cnvObservations?: any[];
    observations?: any[];
}

export interface OncoTrackParams {
    emit: any;
    trackPadding?: number;
    offset: any;
    prefix?: string;
    svg: any;
    rotated?: boolean;
    updateCallback: any;
    resizeCallback: any;
    isFullscreen: boolean;
    trackLegendLabel: any;
    margin?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    genes?: any[];
    donors?: any[];
    width?: number;
    height?: number;
    trackHeight?: number;
    nullSentinel?: number;
    grid?: boolean;
    wrapper: any;
    expandableGroups?: any[];
}

export interface OncoTrackGroupParams {
    emit: Function;
    prefix?: string;
    expandable: boolean;
    cellHeight?: number;
    width: number;
    nullSentinel?: number;
    grid?: boolean;
    domain: any[];
    wrapper?: string;
}

export interface Track {
    collapsed: boolean;
    fieldName: string;
    name: string;
    type: string;
}
