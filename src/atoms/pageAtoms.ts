import { atom } from "recoil";

export interface UserPage {
  creatorId: string | undefined;
  pageName: string;
  id: string;
  creatorName: string;
}

export interface PageSnippet {
  pageId: string;
  creatorName?: string;
  imageURL?: string;
  userUid?: string;
}

interface UserPageState {
  [key: string]:
    | PageSnippet[]
    | { [key: string]: UserPage }
    | UserPage
    | boolean
    | undefined;
  mySnippets: PageSnippet[];
  initSnippetsFetched: boolean;
  visitedPages: {
    [key: string]: UserPage;
  };
  currentPages: UserPage;
}

export const defaultUserPage: UserPage = {
  id: "",
  creatorId: "",
  pageName: "",
  creatorName: "",
};

export const defaultUserPageState: UserPageState = {
  mySnippets: [],
  initSnippetsFetched: false,
  visitedPages: {},
  currentPages: defaultUserPage,
};

export const userPageState = atom<UserPageState>({
  key: "pagesState",
  default: defaultUserPageState,
});
