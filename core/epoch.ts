let _epoch = 1;
export const GlobalEpoch = {
  current(): number { return _epoch; },
  increment(): number { _epoch += 1; return _epoch; },
  validate(e: number): boolean { return e === _epoch; }
};
