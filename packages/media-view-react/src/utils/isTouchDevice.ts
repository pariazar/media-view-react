const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
export default isTouchDevice;
