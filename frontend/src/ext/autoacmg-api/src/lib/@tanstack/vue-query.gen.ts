// This file is auto-generated by @hey-api/openapi-ts

import type { Options } from '@hey-api/client-fetch';
import { queryOptions } from '@tanstack/vue-query';
import type { PredictSeqvarApiV1PredictSeqvarGetData, PredictStrucvarApiV1PredictStrucvarGetData, ResolveVariantApiV1ResolveGetData } from '../types.gen';
import { client, predictSeqvarApiV1PredictSeqvarGet, predictStrucvarApiV1PredictStrucvarGet, resolveVariantApiV1ResolveGet } from '../services.gen';

type QueryKey<TOptions extends Options> = [
    Pick<TOptions, 'baseUrl' | 'body' | 'headers' | 'path' | 'query'> & {
        _id: string;
        _infinite?: boolean;
    }
];

const createQueryKey = <TOptions extends Options>(id: string, options?: TOptions, infinite?: boolean): QueryKey<TOptions>[0] => {
    const params: QueryKey<TOptions>[0] = { _id: id, baseUrl: (options?.client ?? client).getConfig().baseUrl } as QueryKey<TOptions>[0];
    if (infinite) {
        params._infinite = infinite;
    }
    if (options?.body) {
        params.body = options.body;
    }
    if (options?.headers) {
        params.headers = options.headers;
    }
    if (options?.path) {
        params.path = options.path;
    }
    if (options?.query) {
        params.query = options.query;
    }
    return params;
};

export const predictSeqvarApiV1PredictSeqvarGetQueryKey = (options: Options<PredictSeqvarApiV1PredictSeqvarGetData>) => [
    createQueryKey("predictSeqvarApiV1PredictSeqvarGet", options)
];

export const predictSeqvarApiV1PredictSeqvarGetOptions = (options: Options<PredictSeqvarApiV1PredictSeqvarGetData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await predictSeqvarApiV1PredictSeqvarGet({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: predictSeqvarApiV1PredictSeqvarGetQueryKey(options)
}); };

export const predictStrucvarApiV1PredictStrucvarGetQueryKey = (options: Options<PredictStrucvarApiV1PredictStrucvarGetData>) => [
    createQueryKey("predictStrucvarApiV1PredictStrucvarGet", options)
];

export const predictStrucvarApiV1PredictStrucvarGetOptions = (options: Options<PredictStrucvarApiV1PredictStrucvarGetData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await predictStrucvarApiV1PredictStrucvarGet({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: predictStrucvarApiV1PredictStrucvarGetQueryKey(options)
}); };

export const resolveVariantApiV1ResolveGetQueryKey = (options: Options<ResolveVariantApiV1ResolveGetData>) => [
    createQueryKey("resolveVariantApiV1ResolveGet", options)
];

export const resolveVariantApiV1ResolveGetOptions = (options: Options<ResolveVariantApiV1ResolveGetData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await resolveVariantApiV1ResolveGet({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: resolveVariantApiV1ResolveGetQueryKey(options)
}); };