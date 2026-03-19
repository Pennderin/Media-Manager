import { describe, it, expect } from 'vitest';
const {
  SearchSchema,
  MediaRequestSchema,
  PipelineStartSchema,
  SettingsUpdateSchema,
  SftpCredsSchema,
} = require('../src/validation');

describe('SearchSchema', function () {
  it('valid search passes', function () {
    var result = SearchSchema.safeParse({ q: 'The Matrix', type: 'movie' });
    expect(result.success).toBe(true);
    expect(result.data.q).toBe('The Matrix');
  });

  it('valid search with default type', function () {
    var result = SearchSchema.safeParse({ q: 'Inception' });
    expect(result.success).toBe(true);
    expect(result.data.type).toBe('movie');
  });

  it('valid search with tv type', function () {
    var result = SearchSchema.safeParse({ q: 'Breaking Bad', type: 'tv' });
    expect(result.success).toBe(true);
    expect(result.data.type).toBe('tv');
  });

  it('valid search with year as string', function () {
    var result = SearchSchema.safeParse({ q: 'Dune', year: '2021' });
    expect(result.success).toBe(true);
  });

  it('valid search with year as number', function () {
    var result = SearchSchema.safeParse({ q: 'Dune', year: 2021 });
    expect(result.success).toBe(true);
  });

  it('empty query fails', function () {
    var result = SearchSchema.safeParse({ q: '' });
    expect(result.success).toBe(false);
  });

  it('missing query fails', function () {
    var result = SearchSchema.safeParse({ type: 'movie' });
    expect(result.success).toBe(false);
  });

  it('invalid type fails', function () {
    var result = SearchSchema.safeParse({ q: 'Matrix', type: 'anime' });
    expect(result.success).toBe(false);
  });
});

describe('MediaRequestSchema', function () {
  it('valid media request passes', function () {
    var result = MediaRequestSchema.safeParse({
      title: 'The Matrix',
      year: 1999,
      type: 'movie',
      tmdbId: 603,
    });
    expect(result.success).toBe(true);
  });

  it('valid TV request with all fields', function () {
    var result = MediaRequestSchema.safeParse({
      title: 'Breaking Bad',
      year: '2008',
      type: 'tv',
      tmdbId: 1396,
      tvMode: 'season',
      tvSeason: 1,
      tvEpisode: 1,
    });
    expect(result.success).toBe(true);
  });

  it('minimal request (title only) passes', function () {
    var result = MediaRequestSchema.safeParse({ title: 'Inception' });
    expect(result.success).toBe(true);
    expect(result.data.type).toBe('movie');
  });

  it('missing title fails', function () {
    var result = MediaRequestSchema.safeParse({ year: 2024, type: 'movie' });
    expect(result.success).toBe(false);
  });

  it('empty title fails', function () {
    var result = MediaRequestSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('invalid type fails', function () {
    var result = MediaRequestSchema.safeParse({ title: 'Matrix', type: 'documentary' });
    expect(result.success).toBe(false);
  });

  it('invalid tvMode fails', function () {
    var result = MediaRequestSchema.safeParse({ title: 'Show', type: 'tv', tvMode: 'random' });
    expect(result.success).toBe(false);
  });

  it('valid tvMode values pass', function () {
    var modes = ['full', 'season', 'episode', 'latest'];
    for (var i = 0; i < modes.length; i++) {
      var result = MediaRequestSchema.safeParse({ title: 'Show', type: 'tv', tvMode: modes[i] });
      expect(result.success).toBe(true);
    }
  });
});

describe('PipelineStartSchema', function () {
  it('valid pipeline start passes', function () {
    var result = PipelineStartSchema.safeParse({
      title: 'Movie 2024',
      magnetUrl: 'magnet:?xt=urn:btih:abc123',
      type: 'movie',
      year: 2024,
    });
    expect(result.success).toBe(true);
  });

  it('missing title fails', function () {
    var result = PipelineStartSchema.safeParse({ magnetUrl: 'magnet:?xt=urn:btih:abc' });
    expect(result.success).toBe(false);
  });

  it('invalid renameType fails', function () {
    var result = PipelineStartSchema.safeParse({ title: 'Movie', renameType: 'anime' });
    expect(result.success).toBe(false);
  });

  it('valid renameType values pass', function () {
    var types = ['movie', 'tv', 'none'];
    for (var i = 0; i < types.length; i++) {
      var result = PipelineStartSchema.safeParse({ title: 'Movie', renameType: types[i] });
      expect(result.success).toBe(true);
    }
  });
});

describe('SettingsUpdateSchema', function () {
  it('valid settings update passes', function () {
    var result = SettingsUpdateSchema.safeParse({ key: 'theme', value: 'dark' });
    expect(result.success).toBe(true);
  });

  it('numeric value passes', function () {
    var result = SettingsUpdateSchema.safeParse({ key: 'port', value: 9876 });
    expect(result.success).toBe(true);
  });

  it('boolean value passes', function () {
    var result = SettingsUpdateSchema.safeParse({ key: 'autoStart', value: true });
    expect(result.success).toBe(true);
  });

  it('empty key fails', function () {
    var result = SettingsUpdateSchema.safeParse({ key: '', value: 'x' });
    expect(result.success).toBe(false);
  });

  it('missing key fails', function () {
    var result = SettingsUpdateSchema.safeParse({ value: 'x' });
    expect(result.success).toBe(false);
  });
});

describe('SftpCredsSchema', function () {
  it('valid SFTP credentials pass', function () {
    var result = SftpCredsSchema.safeParse({
      host: 'seedbox.example.com',
      port: 22,
      username: 'user',
      password: 'pass123',
    });
    expect(result.success).toBe(true);
  });

  it('default port is 22', function () {
    var result = SftpCredsSchema.safeParse({
      host: 'seedbox.example.com',
      username: 'user',
      password: 'pass123',
    });
    expect(result.success).toBe(true);
    expect(result.data.port).toBe(22);
  });

  it('missing host fails', function () {
    var result = SftpCredsSchema.safeParse({
      username: 'user',
      password: 'pass',
    });
    expect(result.success).toBe(false);
  });

  it('empty host fails', function () {
    var result = SftpCredsSchema.safeParse({
      host: '',
      username: 'user',
      password: 'pass',
    });
    expect(result.success).toBe(false);
  });

  it('missing username fails', function () {
    var result = SftpCredsSchema.safeParse({
      host: 'example.com',
      password: 'pass',
    });
    expect(result.success).toBe(false);
  });

  it('missing password fails', function () {
    var result = SftpCredsSchema.safeParse({
      host: 'example.com',
      username: 'user',
    });
    expect(result.success).toBe(false);
  });

  it('invalid port type fails', function () {
    var result = SftpCredsSchema.safeParse({
      host: 'example.com',
      port: 'abc',
      username: 'user',
      password: 'pass',
    });
    expect(result.success).toBe(false);
  });
});
