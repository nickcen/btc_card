export const usernameRegex = /^([a-zA-Z0-9_]{6,30})$/;

export const deviceNameRegex = /^([a-zA-Z0-9_-]{1})([a-zA-Z0-9_-\s]{0,28})([a-zA-Z0-9_-]{1})$/;

export const spaceRegex = /^([\s]+)$/;

export const numberLetterRegex = /^[A-Za-z0-9]+$/;

export const ICPAmountRegex = /^\d+(\.\d{0,8})?$/;

export const floatNumberRegex = /^\d+\.\d+$/;

export const numberRegex = /^\d{1,}$/;

export const phraseRegex = /([a-z])/;

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
