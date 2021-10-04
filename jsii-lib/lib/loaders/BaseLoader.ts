export default interface BaseLoader {
  loadData: (...args: any[]) => string;
}
