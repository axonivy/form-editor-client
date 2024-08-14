type Consumer<T> = (accept: T) => void;
export type Unary<T> = (apply: T) => T;
export type UpdateConsumer<T> = Consumer<Unary<T>>;

export type AutoCompleteWithString<T> = T | (string & {});

export type DeepPartial<T> = T extends Array<infer U> ? Array<DeepPartial<U>> : { [A in keyof T]?: DeepPartial<T[A]> };
