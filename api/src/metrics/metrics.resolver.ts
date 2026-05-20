import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'

@Resolver(of => Prompt)
export class PromptResolver {
  @Query(returns => [Prompt])
  async prompts (@Ctx() ctx: RQContext) {
    return promptRegistry.list().map(def => new Prompt(def))
  }
}