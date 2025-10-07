import { Router } from "express"
import { body, validationResult } from "express-validator"
import { query } from "../config/database"
import { authenticateToken, type AuthRequest } from "../middleware/auth"

const router = Router()

// GET /api/projects - Get all projects (public)
router.get("/", async (req, res) => {
  try {
    const result = await query("SELECT * FROM projects ORDER BY order_index ASC, created_at DESC")
    res.json({ projects: result.rows })
  } catch (error) {
    console.error("Get projects error:", error)
    res.status(500).json({ error: "Failed to fetch projects" })
  }
})

// GET /api/projects/:id - Get single project (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await query("SELECT * FROM projects WHERE id = $1", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({ project: result.rows[0] })
  } catch (error) {
    console.error("Get project error:", error)
    res.status(500).json({ error: "Failed to fetch project" })
  }
})

// POST /api/projects - Create new project (protected)
router.post(
  "/",
  authenticateToken,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("tech_stack").notEmpty().withMessage("Tech stack is required"),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { title, description, tech_stack, github_url, demo_url, image_url, order_index } = req.body

      const result = await query(
        `INSERT INTO projects (title, description, tech_stack, github_url, demo_url, image_url, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title, description, tech_stack, github_url, demo_url, image_url, order_index || 0],
      )

      res.status(201).json({ project: result.rows[0] })
    } catch (error) {
      console.error("Create project error:", error)
      res.status(500).json({ error: "Failed to create project" })
    }
  },
)

// PUT /api/projects/:id - Update project (protected)
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { title, description, tech_stack, github_url, demo_url, image_url, order_index } = req.body

    const result = await query(
      `UPDATE projects 
       SET title = $1, description = $2, tech_stack = $3, github_url = $4, 
           demo_url = $5, image_url = $6, order_index = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, description, tech_stack, github_url, demo_url, image_url, order_index, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({ project: result.rows[0] })
  } catch (error) {
    console.error("Update project error:", error)
    res.status(500).json({ error: "Failed to update project" })
  }
})

// DELETE /api/projects/:id - Delete project (protected)
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const result = await query("DELETE FROM projects WHERE id = $1 RETURNING id", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    res.status(500).json({ error: "Failed to delete project" })
  }
})

export default router
