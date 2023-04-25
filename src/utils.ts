import { NestApplicationOptions } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import * as https from 'https';

interface Certificates {
  key: string;
  cert: string;
  ca: string;
}

const getCertificates = (): Certificates | undefined => {
  const key = process.env['TLS_KEY'];
  const cert = process.env['TLS_CERT'];
  const ca = process.env['TLS_CA'];
  return !!key && !!cert && !!ca ? { key, cert, ca } : undefined;
};

export const getHttpRequestOptions = (username: string, password: string) => {
  const requestOptions: AxiosRequestConfig = {};
  if (username !== '' && password !== '') {
    requestOptions.auth = {
      username: username,
      password: password,
    };
  }
  const certs = getCertificates();
  if (certs) {
    requestOptions.httpsAgent = new https.Agent(certs);
  }
  return requestOptions;
};

export const getNestOptions = (): NestApplicationOptions => {
  let options: NestApplicationOptions = {};
  const certs = getCertificates();
  if (certs) {
    options.httpsOptions = certs;
  }
  return options;
};
