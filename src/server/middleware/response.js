// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 nirholas (https://github.com/nirholas/agent-voice-chat)

/**
 * Adds consistent response helpers to res object.
 *
 * Envelopes match the SuccessResponse / ErrorResponse schemas in openapi.yaml.
 *
 * res.success(data)          -> { ok: true, data, meta: { timestamp } }
 * res.success(data, 201)     -> same, sent with HTTP 201
 * res.success(data, { page }) -> { ok: true, data, meta: { timestamp, page } }
 * res.fail(code, message, status?, details?) -> { error: { code, message, requestId?, details? } }
 * res.list(items, pagination?) -> { ok: true, data: items, ...pagination, meta: { timestamp } }
 *
 * A status set beforehand with res.status(201).success(data) is preserved.
 */
function responseHelpers(req, res, next) {
  res.success = (data, statusOrMeta) => {
    const statusCode = typeof statusOrMeta === "number" ? statusOrMeta : (res.statusCode || 200)
    const meta = statusOrMeta && typeof statusOrMeta === "object" ? statusOrMeta : {}
    res.status(statusCode).json({
      ok: true,
      data,
      meta: { timestamp: new Date().toISOString(), ...meta }
    })
  }

  // Paginated collections: the rows are `data`, the counters (total, limit,
  // offset, ...) are siblings of it, as documented in openapi.json.
  res.list = (items, pagination = {}) => {
    res.status(res.statusCode || 200).json({
      ok: true,
      data: items,
      ...pagination,
      meta: { timestamp: new Date().toISOString() }
    })
  }

  res.fail = (code, message, status = 400, details) => {
    const error = { code, message }
    if (req.id) error.requestId = req.id
    if (details) error.details = details
    res.status(status).json({ error })
  }

  next()
}

module.exports = { responseHelpers }
