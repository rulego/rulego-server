// Package utils provides various utility functions for working with arrays.
package utils

// InArray checks whether a string is in the slice (case-sensitive)
// Linear traversal (suitable for small data volumes)
// Time complexity O(n), spatial complexity O(1)
func InArray(target string, arr []string) bool {
	for idx := range arr {
		if arr[idx] == target {
			return true
		}
	}
	return false
}
