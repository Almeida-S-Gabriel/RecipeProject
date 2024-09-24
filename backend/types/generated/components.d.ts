import type { Schema, Attribute } from '@strapi/strapi';

export interface TesteCover extends Schema.Component {
  collectionName: 'components_teste_covers';
  info: {
    displayName: 'cover';
  };
  attributes: {
    ll: Attribute.String;
  };
}

export interface CoverCover extends Schema.Component {
  collectionName: 'components_cover_covers';
  info: {
    displayName: 'cover';
    description: '';
  };
  attributes: {};
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'teste.cover': TesteCover;
      'cover.cover': CoverCover;
    }
  }
}
