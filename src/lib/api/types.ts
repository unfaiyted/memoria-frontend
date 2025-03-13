import type { components } from './memoria.v1';

export type UserResponse = components['schemas']['models.UserResponse'];

export type ErrorResponse = components['schemas']['models.ErrorResponse'];
export type User = components['schemas']['models.User'];
export type CreatePasteRequest = components['schemas']['models.CreatePasteRequest'];
export type ErrorType = components['schemas']['models.ErrorType'];
export type Paste = components['schemas']['models.Paste'];

export type UpdatePasteRequest = components['schemas']['models.UpdatePasteRequest'];

export type PasteResponse = components['schemas']['models.APIResponse-models_PasteData'];
export type PasteListResponse = components['schemas']['models.APIResponse-models_PasteListData'];
export type PasteDeleteResponse = components['schemas']['models.APIResponse-uint64'];
