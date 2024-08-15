export const FastGPTProUrl = process.env.PRO_URL ? `${process.env.PRO_URL}/api` : '';
export const isProduction = process.env.NODE_ENV === 'production';
export const GraphUrl = process.env.GRAPH_URL || '';
