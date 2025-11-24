/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiLoginRequest {
  login: string;
  password: string;
}

export interface ApiLoginResponse {
  expires_at?: string;
  token?: string;
  user?: DsMedUserResponse;
}

export interface ApiLogoutRequest {
  token: string;
}

export interface DsCartIconResponse {
  med_card_id?: number;
  med_item_count?: number;
}

export interface DsCompletePvlcMedCardRequest {
  /** "complete" или "reject" */
  action: string;
}

export interface DsCreatePvlcMedFormulaRequest {
  category: string;
  description?: string;
  formula: string;
  gender: string;
  max_age: number;
  min_age: number;
  title: string;
}

export interface DsMedMmPvlcCalculationResponse {
  description?: string;
  final_result?: number;
  formula?: string;
  image_url?: string;
  input_height?: number;
  pvlc_med_formula_id?: number;
  title?: string;
}

export interface DsMedUserResponse {
  id?: number;
  is_moderator?: boolean;
  login?: string;
}

export interface DsPvlcMedCardResponse {
  completed_at?: string;
  created_at?: string;
  doctor_name?: string;
  finalized_at?: string;
  id?: number;
  med_calculations?: DsMedMmPvlcCalculationResponse[];
  patient_name?: string;
  status?: string;
  total_result?: number;
}

export interface DsPvlcMedFormulaResponse {
  category?: string;
  description?: string;
  formula?: string;
  gender?: string;
  id?: number;
  image_url?: string;
  is_active?: boolean;
  max_age?: number;
  min_age?: number;
  title?: string;
}

export interface DsUpdatePvlcMedCardRequest {
  doctor_name?: string;
  patient_name?: string;
}

export interface DsUpdatePvlcMedFormulaRequest {
  category?: string;
  description?: string;
  formula?: string;
  gender?: string;
  is_active?: boolean;
  max_age?: number;
  min_age?: number;
  title?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Lung Capacity Calculation API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @contact API Support <support@lungcalc.ru> (http://localhost:8080)
 *
 * API для расчета должной жизненной емкости легких (ДЖЕЛ)
 * Лабораторная работа 4 - Добавление аутентификации и авторизации
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Выполняет вход пользователя и возвращает JWT токен
     *
     * @tags med_auth
     * @name AuthLoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/api/auth/login
     */
    authLoginCreate: (request: ApiLoginRequest, params: RequestParams = {}) =>
      this.request<ApiLoginResponse, Record<string, string>>({
        path: `/api/auth/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет JWT токен в черный список
     *
     * @tags med_auth
     * @name AuthLogoutCreate
     * @summary Выход пользователя
     * @request POST:/api/auth/logout
     * @secure
     */
    authLogoutCreate: (request: ApiLogoutRequest, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/auth/logout`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о текущем пользователе
     *
     * @tags med_auth
     * @name AuthProfileList
     * @summary Получение профиля пользователя
     * @request GET:/api/auth/profile
     * @secure
     */
    authProfileList: (params: RequestParams = {}) =>
      this.request<DsMedUserResponse, Record<string, string>>({
        path: `/api/auth/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о корзине пользователя (количество items)
     *
     * @tags med_card
     * @name MedCardIconList
     * @summary Получение иконки корзины
     * @request GET:/api/med_card/icon
     * @secure
     */
    medCardIconList: (params: RequestParams = {}) =>
      this.request<DsCartIconResponse, Record<string, string>>({
        path: `/api/med_card/icon`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список заявок пользователя (для модераторов - все заявки)
     *
     * @tags medical-cards
     * @name PvlcMedCardsList
     * @summary Получение списка заявок
     * @request GET:/api/pvlc-med-cards
     * @secure
     */
    pvlcMedCardsList: (
      query?: {
        /** Фильтр по статусу */
        status?: string;
        /** Фильтр по дате от */
        date_from?: string;
        /** Фильтр по дате до */
        date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPvlcMedCardResponse[], Record<string, string>>({
        path: `/api/pvlc-med-cards`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о конкретной заявке
     *
     * @tags medical-cards
     * @name PvlcMedCardsDetail
     * @summary Получение конкретной заявки
     * @request GET:/api/pvlc-med-cards/{id}
     * @secure
     */
    pvlcMedCardsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsPvlcMedCardResponse, Record<string, string>>({
        path: `/api/pvlc-med-cards/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет поля заявки (только для владельца)
     *
     * @tags medical-cards
     * @name PvlcMedCardsUpdate
     * @summary Обновление заявки
     * @request PUT:/api/pvlc-med-cards/{id}
     * @secure
     */
    pvlcMedCardsUpdate: (
      id: number,
      request: DsUpdatePvlcMedCardRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/pvlc-med-cards/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет заявку (только черновики и только владельцем)
     *
     * @tags medical-cards
     * @name PvlcMedCardsDelete
     * @summary Удаление заявки
     * @request DELETE:/api/pvlc-med-cards/{id}
     * @secure
     */
    pvlcMedCardsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/pvlc-med-cards/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Завершает или отклоняет заявку (только для модераторов)
     *
     * @tags medical-cards
     * @name PvlcMedCardsCompleteUpdate
     * @summary Завершение/отклонение заявки
     * @request PUT:/api/pvlc-med-cards/{id}/complete
     * @secure
     */
    pvlcMedCardsCompleteUpdate: (
      id: number,
      request: DsCompletePvlcMedCardRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/api/pvlc-med-cards/${id}/complete`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит заявку из статуса черновика в сформированную
     *
     * @tags medical-cards
     * @name PvlcMedCardsFormUpdate
     * @summary Формирование заявки
     * @request PUT:/api/pvlc-med-cards/{id}/form
     * @secure
     */
    pvlcMedCardsFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/pvlc-med-cards/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список формул с возможностью фильтрации
     *
     * @tags med_formulas
     * @name PvlcMedFormulasList
     * @summary Получение списка формул
     * @request GET:/api/pvlc-med-formulas
     */
    pvlcMedFormulasList: (
      query?: {
        /** Фильтр по категории */
        category?: string;
        /** Фильтр по полу */
        gender?: string;
        /** Минимальный возраст */
        min_age?: number;
        /** Максимальный возраст */
        max_age?: number;
        /** Активные формулы */
        active?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPvlcMedFormulaResponse[], any>({
        path: `/api/pvlc-med-formulas`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую формулу для расчета ДЖЕЛ (только для модераторов)
     *
     * @tags med_formulas
     * @name PvlcMedFormulasCreate
     * @summary Создание новой формулы
     * @request POST:/api/pvlc-med-formulas
     * @secure
     */
    pvlcMedFormulasCreate: (
      request: DsCreatePvlcMedFormulaRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/api/pvlc-med-formulas`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о конкретной формуле ДЖЕЛ
     *
     * @tags med_formulas
     * @name PvlcMedFormulasDetail
     * @summary Получение конкретной формулы
     * @request GET:/api/pvlc-med-formulas/{id}
     */
    pvlcMedFormulasDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsPvlcMedFormulaResponse, Record<string, string>>({
        path: `/api/pvlc-med-formulas/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет существующую формулу ДЖЕЛ (только для модераторов)
     *
     * @tags med_formulas
     * @name PvlcMedFormulasUpdate
     * @summary Обновление формулы
     * @request PUT:/api/pvlc-med-formulas/{id}
     * @secure
     */
    pvlcMedFormulasUpdate: (
      id: number,
      request: DsUpdatePvlcMedFormulaRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/pvlc-med-formulas/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет формулу ДЖЕЛ (только для модераторов)
     *
     * @tags med_formulas
     * @name PvlcMedFormulasDelete
     * @summary Удаление формулы
     * @request DELETE:/api/pvlc-med-formulas/{id}
     * @secure
     */
    pvlcMedFormulasDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/pvlc-med-formulas/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет формулу в заявку-черновик пользователя
     *
     * @tags med_formulas
     * @name PvlcMedFormulasAddToCartCreate
     * @summary Добавление формулы в корзину
     * @request POST:/api/pvlc-med-formulas/{id}/add-to-cart
     * @secure
     */
    pvlcMedFormulasAddToCartCreate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/api/pvlc-med-formulas/${id}/add-to-cart`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для формулы ДЖЕЛ в MinIO (только для модераторов)
     *
     * @tags med_formulas
     * @name PvlcMedFormulasImageCreate
     * @summary Загрузка изображения для формулы
     * @request POST:/api/pvlc-med-formulas/{id}/image
     * @secure
     */
    pvlcMedFormulasImageCreate: (
      id: number,
      data: {
        /** Изображение формулы */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/pvlc-med-formulas/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
}
