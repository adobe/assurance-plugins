/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

const pad = (n, length = 2) => n.toString().padStart(length, '0');

export const getTimestampText = (timestamp) => {
  const timestampDate = new Date(timestamp);
  return `${timestampDate.getFullYear()}-${pad(timestampDate.getMonth() + 1)}-${pad(timestampDate.getDate())} 
  ${pad(timestampDate.getHours())}:${pad(timestampDate.getMinutes())}:${pad(timestampDate.getSeconds())}.${pad(timestampDate.getMilliseconds(), 3)}`;
};
