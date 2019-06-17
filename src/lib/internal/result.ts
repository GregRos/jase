/**
 * @module parjs
 */
/** */
import {ParjsParsingFailure} from "../errors";
import {Parjser} from "./parjser";
import {visualizeTrace} from "./trace-visualizer";


/**
 * Indicates a success reply and contains the value and other information.
 */
export class ParjsSuccess<T> {
    kind = ResultKind.Ok;

    constructor(public value: T) {

    }

    toString() {
        return `SuccessReply: ${this.value}`;
    }
}

/**
 * Info about a potential rejection.
 */
export interface RejectionInfo {
    kind: ResultKind.Fail;
    reason: string | object;
}

/**
 * The row and column of where a rejection happened.
 */
export interface ErrorLocation {
    row: number;
    column: number;
}

/**
 * An object indicating trace information about the state of parsing when it was stopped.
 */
export interface Trace extends RejectionInfo {
    userState: object;
    position: number;
    location: ErrorLocation;
    stackTrace: Parjser<any>[];
    input: string;
}

/**
 * A rejection result from a Parjs parser.
 */
export class ParjsRejection implements RejectionInfo{
    constructor(public trace: Trace) {

    }

    get value(): never {
        throw new ParjsParsingFailure(this);
    }

    get kind() {
        return this.trace.kind;
    }

    get reason() {
        return this.trace.reason;
    }

    toString() {
        return visualizeTrace(this.trace);
    }
}


/**
 * A type that represents a ParjsSuccess or a ParjsRejection. Returned by parsers.
 */
export type ParjsResult<T> = (ParjsSuccess<T> | ParjsRejection);


/**
 * Namespace that contains the different reply kinds/error levels.
 */
export namespace ResultKind {
    /**
     * An Unknown reply. Used internally.
     */
    export type Unknown = "Unknown";
    /**
     * The OK reply type.
     */
    export type Ok = "OK";
    /**
     * The soft failure type.
     */
    export type SoftFail = "Soft";
    /**
     * The hard failure type.
     */
    export type HardFail = "Hard";
    /**
     * The fatal failure type.
     */
    export type FatalFail = "Fatal";

    /**
     * An Unknown reply.
     */
    export const Unknown: Unknown = "Unknown";
    /**
     * An OK reply.
     */
    export const Ok: Ok = "OK";
    /**
     * A soft failure reply.
     */
    export const SoftFail: SoftFail = "Soft";
    /**
     * A hard failure reply.
     */
    export const HardFail: HardFail = "Hard";
    /**
     * A fatal failure reply.
     */
    export const FatalFail: FatalFail = "Fatal";

    /**
     * Specifies any kind of failure.
     */
    export type Fail = HardFail | FatalFail | SoftFail;
}
/**
 * Specifies a reply kind, indicating success or failure, and the severity of the failure.
 */
export type ResultKind = ResultKind.Ok | ResultKind.Fail | ResultKind.Unknown;
