export interface IProps {
  url?: string
  handleChange?(value: string, e: React.ChangeEvent<HTMLInputElement>): void
}

export interface IState {
  url: string
}
