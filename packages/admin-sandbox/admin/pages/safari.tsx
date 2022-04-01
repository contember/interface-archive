import { Checkbox, EditPage, FieldContainer, Heading, noop } from '@contember/admin'

export default (
	<EditPage entity="Homepage(unique = One)" setOnCreate="(unique = One)">
		<Heading depth={3}>Test case for Safari performance issue</Heading>

    <p>Safari has problems with <code>:focus-within</code> pseudoclass. Proposed solution was to
    use <a href="https://github.com/WICG/focus-visible#readme" target="_blank">hack</a>.
    However using <code>:not</code> together with <code>:focus-within</code> caused major
    redrawal and style recalculation issues in Safari.</p>

    {[...new Array(30 * 8)].map((v, index) => <FieldContainer
      label={`Checkbox ${index}`}
    >
      {/* <input type="checkbox" /> */}
      <Checkbox value={true} onChange={noop}>{`Checkbox ${index}`} </Checkbox>
    </FieldContainer>)}
	</EditPage>
)
