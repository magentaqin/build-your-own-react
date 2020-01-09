import options from '../options'
/** call callback in c._renderCallbacks
 * @param commitQueue list of components which have callbacks to invoke in commitRoot
 * @param root
 */
export const commitRoot = (commitQueue, root) => {
  if (options._commit) options._commit(root, commitQueue);

	commitQueue.some(c => {
		try {
			commitQueue = c._renderCallbacks;
			c._renderCallbacks = [];
			commitQueue.some(cb => {
				cb && cb.call(c);
			});
		} catch (e) {
			options._catchError(e, c._vnode);
		}
	});
}